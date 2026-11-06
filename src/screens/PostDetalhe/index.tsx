import AppHeader from "@/components/AppHeader/AppHeader";
import ComentarioItem from "@/components/ComentarioItem/ComentarioItem";
import ConteudoFormatado from "@/components/ConteudoFormatado/ConteudoFormatado";
import PostFormModal from "@/components/PostFormModal/PostFormModal";
import { Cores } from "@/constants/colors";
import { PerfilUsuario } from "@/constants/Perfis";
import { useAuth } from "@/contexts/AuthContext";
import type { Comentario } from "@/types/comentarios";
import type { PostFormValues } from "@/types/posts";
import { formatarData } from "@/utils/data";
import { confirmarExclusao } from "@/utils/confirmar";
import { marcarPostsAlterados } from "@/utils/postsVersao";
import { mostrarErro, mostrarMensagem } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    atualizarPostController,
    carregarPostController,
    excluirPostController,
} from "../ManagerPosts/index.controller";
import {
    carregarDetalheController,
    criarComentarioController,
    editarComentarioController,
    excluirComentarioController,
    LIMITE_COMENTARIO,
    listarComentariosController,
    podeModificarComentario,
    podeModificarPostDetalhe,
    type DetalhePost,
} from "./index.controller";
import styles from "./index.styles";

export default function PostDetalhe({ postId }: { postId: number }) {
    const router = useRouter();
    const { usuario } = useAuth();

    const [post, setPost] = useState<DetalhePost | null>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const [novoComentario, setNovoComentario] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);

    const carregar = useCallback(async () => {
        try {
            const resultado = await carregarDetalheController(postId);

            setPost(resultado.post);
            setComentarios(resultado.comentarios);
            setErro(null);
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível carregar o post.");
        } finally {
            setCarregando(false);
        }
    }, [postId]);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    const voltar = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/");
        }
    };

    const recarregarComentarios = async () => {
        setComentarios(await listarComentariosController(postId));
    };

    const handleEnviarComentario = async () => {
        if (enviando) return;

        try {
            setEnviando(true);
            await criarComentarioController(postId, novoComentario, usuario);
            setNovoComentario("");
            await recarregarComentarios();
            mostrarMensagem("Comentário criado com sucesso!");
        } catch (error) {
            mostrarErro(error, "Não foi possível enviar o comentário.");
        } finally {
            setEnviando(false);
        }
    };

    const handleEditarComentario = async (id: number, conteudo: string) => {
        try {
            await editarComentarioController(id, postId, conteudo, usuario);
            await recarregarComentarios();
            mostrarMensagem("Comentário editado com sucesso!");
        } catch (error) {
            mostrarErro(error, "Erro ao editar o comentário.");
            throw error;
        }
    };

    const handleExcluirComentario = (id: number) => {
        confirmarExclusao(
            "Excluir comentário",
            "Tem certeza que deseja excluir este comentário? Essa ação não pode ser desfeita.",
            async () => {
                try {
                    await excluirComentarioController(id, usuario);
                    await recarregarComentarios();
                    mostrarMensagem("Comentário excluído com sucesso!");
                } catch (error) {
                    mostrarErro(error, "Erro ao excluir o comentário.");
                }
            }
        );
    };

    const handleSalvarPost = async (valores: PostFormValues) => {
        try {
            await atualizarPostController(postId, valores, usuario);
            marcarPostsAlterados();
            mostrarMensagem("Post atualizado com sucesso!");
            await carregar();
        } catch (error) {
            mostrarErro(error, "Erro ao atualizar post.");
            throw error;
        }
    };

    const handleExcluirPost = () => {
        confirmarExclusao(
            "Excluir post?",
            "Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.",
            async () => {
                try {
                    await excluirPostController(postId, usuario);
                    marcarPostsAlterados();
                    mostrarMensagem("Post excluído com sucesso!");
                    voltar();
                } catch (error) {
                    mostrarErro(error, "Erro ao excluir post.");
                }
            }
        );
    };

    const podeModificarPost = podeModificarPostDetalhe(usuario, post);
    const autorAdmin = post?.autorPerfilId === PerfilUsuario.ADMIN;

    const renderConteudo = () => {
        if (carregando) {
            return (
                <View style={styles.carregando}>
                    <ActivityIndicator color={Cores.primaria} />
                    <Text style={styles.textoEstado}>Carregando post...</Text>
                </View>
            );
        }

        if (erro || !post) {
            return (
                <View style={styles.carregando}>
                    <Text style={styles.textoEstado}>{erro ?? "Post não encontrado."}</Text>
                </View>
            );
        }

        return (
            <>
                <View style={styles.artigo}>
                    {!!post.disciplina && (
                        <View style={styles.badgeDisciplina}>
                            <Text style={styles.badgeDisciplinaTexto}>{post.disciplina}</Text>
                        </View>
                    )}

                    <Text style={styles.titulo}>{post.titulo}</Text>

                    <View style={styles.autorLinha}>
                        <Text style={styles.autorNome}>{post.autorNome}</Text>

                        {post.autorPerfilId !== null && (
                            <View
                                style={[
                                    styles.papel,
                                    { backgroundColor: autorAdmin ? "#fef3c7" : "#e0f2fe" },
                                ]}
                            >
                                <Text style={[styles.papelTexto, { color: autorAdmin ? "#b45309" : "#0369a1" }]}>
                                    {autorAdmin ? "Administrador(a)" : "Professor(a)"}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.dataPublicacao}>Publicado em {formatarData(post.dataAtualizacao)}</Text>

                    <View style={styles.linha} />

                    <ConteudoFormatado conteudo={post.conteudo} />

                    <View style={styles.linha} />

                    <Text style={styles.tituloComentarios}>Comentários ({comentarios.length})</Text>

                    {comentarios.length === 0 && (
                        <Text style={styles.semComentarios}>Ainda não há comentários.</Text>
                    )}

                    {comentarios.map((comentario) => (
                        <ComentarioItem
                            key={comentario.id}
                            comentario={comentario}
                            podeModificar={podeModificarComentario(usuario, comentario, post)}
                            onEditar={handleEditarComentario}
                            onExcluir={handleExcluirComentario}
                        />
                    ))}

                    <View style={styles.linha} />

                    <View style={styles.novoComentario}>
                        <TextInput
                            style={styles.inputComentario}
                            value={novoComentario}
                            onChangeText={setNovoComentario}
                            placeholder="Escreva um comentário..."
                            placeholderTextColor={Cores.textoSuave}
                            multiline
                            maxLength={LIMITE_COMENTARIO}
                            textAlignVertical="top"
                        />

                        <Text style={styles.contador}>
                            {novoComentario.length}/{LIMITE_COMENTARIO}
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.botaoEnviar,
                                (enviando || !novoComentario.trim()) && styles.botaoEnviarDesabilitado,
                            ]}
                            onPress={handleEnviarComentario}
                            disabled={enviando || !novoComentario.trim()}
                        >
                            <Text style={styles.botaoEnviarTexto}>{enviando ? "Enviando..." : "Enviar"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.tela}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <PostFormModal
                visible={modalAberto}
                postId={postId}
                autorNome={post?.autorNome ?? usuario?.nome ?? ""}
                onClose={() => setModalAberto(false)}
                carregar={carregarPostController}
                onSubmit={handleSalvarPost}
            />

            <AppHeader />

            <ScrollView
                contentContainerStyle={styles.conteudoTela}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.barra}>
                    <TouchableOpacity style={styles.botaoVoltar} onPress={voltar} accessibilityLabel="Voltar">
                        <Ionicons name="arrow-back" size={18} color={Cores.textoSecundario} />
                        <Text style={styles.botaoVoltarTexto}>Voltar</Text>
                    </TouchableOpacity>

                    {podeModificarPost && (
                        <View style={styles.acoesPost}>
                            <TouchableOpacity
                                style={styles.botaoAcao}
                                onPress={() => setModalAberto(true)}
                                accessibilityLabel="Editar post"
                            >
                                <Ionicons name="pencil" size={15} color="#374151" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botaoAcao, styles.botaoExcluir]}
                                onPress={handleExcluirPost}
                                accessibilityLabel="Excluir post"
                            >
                                <Ionicons name="trash" size={15} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {renderConteudo()}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
