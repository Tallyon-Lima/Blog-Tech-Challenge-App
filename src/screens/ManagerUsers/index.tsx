
import UsuarioModal, { NovoUsuario } from "@/components/UsuarioModal/UsuarioModal";
import {
    COR_PAPEL_PADRAO,
    CORES_PAPEL,
    OPCOES_FILTRO_PAPEL,
    TODOS_PAPEIS,
    type FiltroPapel,
} from "@/constants/Papeis";
import type { Usuario } from "@/types/usuarios";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    atualizarUsuarioController,
    criarUsuarioController,
    excluirUsuarioController,
    listarUsuariosController,
} from "./index.controller";
import styles from "./index.styles";

const LIMITE_POR_PAGINA = 15;

export default function ManagerUsers() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [atualizando, setAtualizando] = useState(false);
    const [temMais, setTemMais] = useState(true);

    const [busca, setBusca] = useState("");
    const [buscaAplicada, setBuscaAplicada] = useState("");
    const [filtroPapel, setFiltroPapel] = useState<FiltroPapel>(TODOS_PAPEIS);
    const [filtroAberto, setFiltroAberto] = useState(false);

    const [modalAberto, setModalAberto] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState<(NovoUsuario & { id: number }) | null>(null);

    const paginaAtual = useRef(1);
    const idRequisicao = useRef(0);

    const mostrarErro = (error: unknown, mensagem: string) => {
        ToastAndroid.show(
            error instanceof Error ? error.message : mensagem,
            ToastAndroid.SHORT
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => setBuscaAplicada(busca), 400);
        return () => clearTimeout(timer);
    }, [busca]);

    const buscarPagina = useCallback(async (pagina: number) => {
        const id = ++idRequisicao.current;

        try {
            const resultado = await listarUsuariosController({
                page: pagina,
                limit: LIMITE_POR_PAGINA,
                busca: buscaAplicada,
                papel: filtroPapel === TODOS_PAPEIS ? undefined : filtroPapel,
            });

            if (id !== idRequisicao.current) return;

            setUsuarios(atual =>
                pagina === 1
                    ? resultado.usuarios ?? []
                    : [...atual, ...(resultado.usuarios ?? [])]
            );

            paginaAtual.current = pagina;
            setTemMais(pagina < resultado.totalPaginas);

        } catch (error) {
            if (id === idRequisicao.current) {
                mostrarErro(error, "Não foi possível carregar os usuários.");
            }
        } finally {
            if (id === idRequisicao.current) {
                setCarregando(false);
                setCarregandoMais(false);
                setAtualizando(false);
            }
        }
    }, [buscaAplicada, filtroPapel]);

    // Reinicia a listagem quando a busca ou o filtro mudam
    useEffect(() => {
        setCarregando(true);
        buscarPagina(1);
    }, [buscarPagina]);

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
        setUsuarioEditando(null);
        setModalAberto(true);
    };

    const handleEditar = (usuario: Usuario) => {
        setUsuarioEditando({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            cpf: usuario.cpf,
            perfil: usuario.papel,
        });

        setModalAberto(true);
    };

    const handleSalvar = async (dados: NovoUsuario) => {
        try {
            if (usuarioEditando) {
                await atualizarUsuarioController(usuarioEditando.id, dados);
            } else {
                await criarUsuarioController(dados);
            }

            await atualizar();
        } catch (error) {
            mostrarErro(error, "Não foi possível salvar o usuário.");
            throw error;
        }
    };

    const handleExcluir = (usuario: Usuario) => {
        Alert.alert("Excluir usuário", `Deseja excluir ${usuario.nome}?`, [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    try {
                        await excluirUsuarioController(usuario.id);
                        await atualizar();
                    } catch (error) {
                        mostrarErro(error, "Não foi possível excluir o usuário.");
                    }
                },
            },
        ]);
    };

    const renderCabecalho = () => (
        <View style={styles.conteudoTopo}>
            <Text style={styles.titulo}>Gerenciar Usuários</Text>

            <Text style={styles.subtitulo}>
                Administre professores, adicione novos educadores ou estudantes.
            </Text>

            <TouchableOpacity style={styles.botaoNovo} onPress={handleNovo}>
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.botaoNovoTexto}>Novo</Text>
            </TouchableOpacity>

            <View style={styles.campoBusca}>
                <Ionicons name="search" size={16} color="#9ca3af" />

                <TextInput
                    style={styles.inputBusca}
                    placeholder="Buscar por nome ou e-mail..."
                    placeholderTextColor="#9ca3af"
                    value={busca}
                    onChangeText={setBusca}
                />
            </View>

            <TouchableOpacity
                style={[styles.select, filtroAberto && styles.selectAberto]}
                onPress={() => setFiltroAberto(!filtroAberto)}
            >
                <Text style={styles.selectTexto}>{filtroPapel}</Text>
                <Ionicons
                    name={filtroAberto ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#374151"
                />
            </TouchableOpacity>

            {filtroAberto && (
                <View style={styles.opcoes}>
                    {OPCOES_FILTRO_PAPEL.map(papel => (
                        <TouchableOpacity
                            key={papel}
                            style={[
                                styles.opcao,
                                filtroPapel === papel && styles.opcaoSelecionada,
                            ]}
                            onPress={() => {
                                setFiltroPapel(papel);
                                setFiltroAberto(false);
                            }}
                        >
                            <Text
                                style={[
                                    styles.opcaoTexto,
                                    filtroPapel === papel && styles.opcaoTextoSelecionada,
                                ]}
                            >
                                {papel}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.tela} edges={["top"]}>
            <UsuarioModal
                visible={modalAberto}
                onClose={() => setModalAberto(false)}
                usuario={usuarioEditando}
                onSubmit={handleSalvar}
            />

            <View style={styles.header}>
                <TouchableOpacity style={styles.botaoMenu}>
                    <Ionicons name="menu" size={22} color="#fff" />
                </TouchableOpacity>

                <Image
                    source={require("../../../assets/images/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.headerTitulo}>BlogTech</Text>
            </View>

            <FlatList
                data={usuarios}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => {
                    const cor = CORES_PAPEL[item.papel] ?? COR_PAPEL_PADRAO;

                    return (
                        <View style={styles.card}>
                            <View style={styles.cardTopo}>
                                <Text style={styles.cardNome}>{item.nome}</Text>

                                <View style={[styles.badge, { backgroundColor: cor.fundo }]}>
                                    <Text style={[styles.badgeTexto, { color: cor.texto }]}>
                                        {item.papel ?? "Sem perfil"}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.cardEmail}>{item.email}</Text>

                            <View style={styles.acoes}>
                                <TouchableOpacity
                                    style={styles.botaoAcao}
                                    onPress={() => handleEditar(item)}
                                >
                                    <Ionicons name="pencil" size={15} color="#374151" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.botaoAcao, styles.botaoExcluir]}
                                    onPress={() => handleExcluir(item)}
                                >
                                    <Ionicons name="trash" size={15} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
                ListHeaderComponent={renderCabecalho()}
                ListFooterComponent={
                    carregandoMais ? (
                        <ActivityIndicator style={{ marginVertical: 16 }} color="#2563eb" />
                    ) : undefined
                }
                ListEmptyComponent={
                    <View style={styles.carregando}>
                        <ActivityIndicator
                            animating={carregando}
                            size="small"
                            color="#2563eb"
                        />
                        <Text style={styles.vazio}>
                            {carregando ? "Carregando usuários..." : "Nenhum usuário encontrado."}
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
        </SafeAreaView>
    );
}
