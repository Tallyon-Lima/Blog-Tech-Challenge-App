import AppHeader from "@/components/AppHeader/AppHeader";
import PostFormModal from "@/components/PostFormModal/PostFormModal";
import { Cores } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import type { Post, PostFormValues } from "@/types/posts";
import { confirmarExclusao } from "@/utils/confirmar";
import { marcarPostsAlterados, versaoDosPosts } from "@/utils/postsVersao";
import { mostrarErro, mostrarMensagem } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    atualizarPostController,
    carregarPostController,
    criarPostController,
    excluirPostController,
    listarPostsController,
    podeModificarPost,
} from "./index.controller";
import styles from "./index.styles";

const LIMITE_POR_PAGINA = 10;

const MESES_ABREVIADOS = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function formatarData(dataIso: string) {
    const data = new Date(dataIso);

    if (Number.isNaN(data.getTime())) return "";

    return `${data.getDate()} de ${MESES_ABREVIADOS[data.getMonth()]}, ${data.getFullYear()}`;
}

export default function ManagerPosts() {
    const router = useRouter();
    const { usuario } = useAuth();

    const [posts, setPosts] = useState<Post[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [atualizando, setAtualizando] = useState(false);
    const [temMais, setTemMais] = useState(true);

    const [busca, setBusca] = useState("");
    const [buscaAplicada, setBuscaAplicada] = useState("");

    const [modalAberto, setModalAberto] = useState(false);
    const [postEditando, setPostEditando] = useState<Post | null>(null);

    const paginaAtual = useRef(1);
    const idRequisicao = useRef(0);
    const chaveCarregada = useRef<string | null>(null);

    // Espera o usuário parar de digitar antes de buscar
    useEffect(() => {
        const timer = setTimeout(() => {
            if (busca === buscaAplicada) return;

            setCarregando(true);
            setBuscaAplicada(busca);
        }, 400);

        return () => clearTimeout(timer);
    }, [busca, buscaAplicada]);

    const buscarPagina = useCallback(async (pagina: number) => {
        const id = ++idRequisicao.current;

        try {
            const resultado = await listarPostsController({
                paginaAtual: pagina,
                itensPagina: LIMITE_POR_PAGINA,
                pesquisa: buscaAplicada,
            });

            // Ignora respostas de buscas antigas
            if (id !== idRequisicao.current) return;

            setPosts(atual => (pagina === 1 ? resultado.posts : [...atual, ...resultado.posts]));

            paginaAtual.current = pagina;
            setTemMais(resultado.temMais);
        } catch (error) {
            if (id === idRequisicao.current) {
                mostrarErro(error, "Não foi possível carregar os posts.");
            }
        } finally {
            if (id === idRequisicao.current) {
                setCarregando(false);
                setCarregandoMais(false);
                setAtualizando(false);
            }
        }
    }, [buscaAplicada]);

    // Carrega na primeira vez, quando a busca muda e quando algum post foi alterado em outra tela
    // (por exemplo, editado ou excluído no detalhe).
    useFocusEffect(
        useCallback(() => {
            const chave = `${versaoDosPosts()}|${buscaAplicada}`;

            if (chaveCarregada.current === chave) return;

            chaveCarregada.current = chave;
            buscarPagina(1);
        }, [buscaAplicada, buscarPagina])
    );

    const carregarMais = () => {
        if (carregando || carregandoMais || atualizando || !temMais) return;

        setCarregandoMais(true);
        buscarPagina(paginaAtual.current + 1);
    };

    const atualizar = () => {
        setAtualizando(true);
        return buscarPagina(1);
    };

    const handleNovo = () => {
        setPostEditando(null);
        setModalAberto(true);
    };

    const handleEditar = (post: Post) => {
        setPostEditando(post);
        setModalAberto(true);
    };

    const handleSalvar = async (valores: PostFormValues, postId?: number | null) => {
        try {
            if (postId) {
                await atualizarPostController(postId, valores, usuario);
                mostrarMensagem("Post atualizado com sucesso!");
            } else {
                await criarPostController(valores, usuario);
                mostrarMensagem("Post criado com sucesso!");
            }

            marcarPostsAlterados();
            await atualizar();
        } catch (error) {
            mostrarErro(error, "Não foi possível salvar o post.");
            throw error;
        }
    };

    const handleExcluir = (post: Post) => {
        confirmarExclusao(
            "Excluir post?",
            "Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.",
            async () => {
                try {
                    await excluirPostController(post.id, usuario);
                    mostrarMensagem("Post excluído com sucesso!");
                    marcarPostsAlterados();
                    await atualizar();
                } catch (error) {
                    mostrarErro(error, "Não foi possível excluir o post.");
                }
            }
        );
    };

    const renderCabecalho = () => (
        <View style={styles.conteudoTopo}>
            <Text style={styles.titulo}>Gerenciar Posts</Text>

            <Text style={styles.subtitulo}>Acompanhe, edite ou remova as publicações do Blog</Text>

            <TouchableOpacity style={styles.botaoNovo} onPress={handleNovo}>
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.botaoNovoTexto}>Novo</Text>
            </TouchableOpacity>

            <View style={styles.campoBusca}>
                <Ionicons name="search" size={16} color={Cores.textoSuave} />

                <TextInput
                    style={styles.inputBusca}
                    placeholder="Buscar por palavra-chave..."
                    placeholderTextColor={Cores.textoSuave}
                    value={busca}
                    onChangeText={setBusca}
                    returnKeyType="search"
                />
            </View>
        </View>
    );

    return (
        <View style={styles.tela}>
            <PostFormModal
                visible={modalAberto}
                postId={postEditando?.id}
                autorNome={postEditando?.autor ?? usuario?.nome ?? ""}
                onClose={() => setModalAberto(false)}
                carregar={carregarPostController}
                onSubmit={handleSalvar}
            />

            <AppHeader />

            <FlatList
                data={posts}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardTopo}>
                            <Text style={styles.cardTitulo}>{item.titulo}</Text>

                            <View style={styles.badge}>
                                <Text style={styles.badgeTexto}>{item.disciplina}</Text>
                            </View>
                        </View>

                        <View style={styles.cardInfo}>
                            <Ionicons name="person-outline" size={13} color={Cores.textoSecundario} />
                            <Text style={styles.cardInfoTexto}>{item.autor ?? "Autor não informado"}</Text>
                        </View>

                        <View style={styles.cardInfo}>
                            <Ionicons name="calendar-outline" size={13} color={Cores.textoSecundario} />
                            <Text style={styles.cardInfoTexto}>{formatarData(item.dataCriacao)}</Text>
                        </View>

                        <View style={styles.acoes}>
                            <TouchableOpacity
                                style={styles.botaoAcao}
                                onPress={() => router.push({ pathname: "/post/[id]", params: { id: String(item.id) } })}
                                accessibilityLabel="Visualizar post"
                            >
                                <Ionicons name="eye" size={15} color="#374151" />
                            </TouchableOpacity>

                            {podeModificarPost(usuario, item) && (
                                <>
                                    <TouchableOpacity
                                        style={styles.botaoAcao}
                                        onPress={() => handleEditar(item)}
                                        accessibilityLabel="Editar post"
                                    >
                                        <Ionicons name="pencil" size={15} color="#374151" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.botaoAcao, styles.botaoExcluir]}
                                        onPress={() => handleExcluir(item)}
                                        accessibilityLabel="Excluir post"
                                    >
                                        <Ionicons name="trash" size={15} color="#fff" />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                )}
                ListHeaderComponent={renderCabecalho()}
                ListFooterComponent={
                    carregandoMais ? (
                        <ActivityIndicator style={{ marginVertical: 16 }} color={Cores.primaria} />
                    ) : undefined
                }
                ListEmptyComponent={
                    <View style={styles.carregando}>
                        <ActivityIndicator animating={carregando} size="small" color={Cores.primaria} />
                        <Text style={styles.vazio}>
                            {carregando ? "Carregando posts..." : "Nenhum post encontrado."}
                        </Text>
                    </View>
                }
                contentContainerStyle={styles.lista}
                keyboardShouldPersistTaps="handled"
                onEndReached={carregarMais}
                onEndReachedThreshold={0.5}
                refreshing={atualizando}
                onRefresh={atualizar}
            />
        </View>
    );
}
