import AppHeader from "@/components/AppHeader/AppHeader";
import PostCard from "@/components/PostCard/PostCard";
import { Cores } from "@/constants/colors";
import type { Post } from "@/types/posts";
import { juntarSemRepetir } from "@/utils/listas";
import { versaoDosPosts } from "@/utils/postsVersao";
import { mostrarErro } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { listarPostsController } from "../ManagerPosts/index.controller";
import styles from "./index.styles";

const LIMITE_POR_PAGINA = 8;

export default function Home() {
    const router = useRouter();

    const [posts, setPosts] = useState<Post[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [atualizando, setAtualizando] = useState(false);
    const [temMais, setTemMais] = useState(true);

    const [busca, setBusca] = useState("");
    const [buscaAplicada, setBuscaAplicada] = useState("");
    const [buscaFocada, setBuscaFocada] = useState(false);

    const paginaAtual = useRef(1);
    const idRequisicao = useRef(0);
    const buscandoMais = useRef(false);
    const chaveCarregada = useRef<string | null>(null);

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

            if (id !== idRequisicao.current) return;

            setPosts(atual => (pagina === 1 ? resultado.posts : juntarSemRepetir(atual, resultado.posts)));

            paginaAtual.current = pagina;
            setTemMais(resultado.temMais);
        } catch (error) {
            if (id === idRequisicao.current) {
                mostrarErro(error, "Não foi possível carregar os posts.");
            }
        } finally {
            if (id === idRequisicao.current) {
                buscandoMais.current = false;
                setCarregando(false);
                setCarregandoMais(false);
                setAtualizando(false);
            }
        }
    }, [buscaAplicada]);

    useFocusEffect(
        useCallback(() => {
            const chave = `${versaoDosPosts()}|${buscaAplicada}`;

            if (chaveCarregada.current === chave) return;

            chaveCarregada.current = chave;
            buscarPagina(1);
        }, [buscaAplicada, buscarPagina])
    );

    const carregarMais = () => {
        if (buscandoMais.current || carregando || carregandoMais || atualizando || !temMais) return;

        buscandoMais.current = true;
        setCarregandoMais(true);
        buscarPagina(paginaAtual.current + 1);
    };

    const atualizar = () => {
        setAtualizando(true);
        return buscarPagina(1);
    };

    const abrirPost = (post: Post) => {
        router.push({ pathname: "/post/[id]", params: { id: String(post.id) } });
    };

    const renderCabecalho = () => (
        <View style={styles.topo}>
            <Text style={styles.titulo}>Posts Recentes</Text>
            <Text style={styles.subtitulo}>Fique por dentro das últimas publicações e materiais</Text>

            <View style={[styles.campoBusca, buscaFocada && styles.campoBuscaFocado]}>
                <Ionicons name="search" size={18} color={Cores.textoSecundario} />

                <TextInput
                    style={styles.inputBusca}
                    placeholder="Busque por palavras-chave"
                    placeholderTextColor="#666"
                    value={busca}
                    onChangeText={setBusca}
                    onFocus={() => setBuscaFocada(true)}
                    onBlur={() => setBuscaFocada(false)}
                    returnKeyType="search"
                />
            </View>
        </View>
    );

    return (
        <View style={styles.tela}>
            <AppHeader />

            <FlatList
                data={posts}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => <PostCard post={item} onPress={() => abrirPost(item)} />}
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
                            {carregando ? "Carregando posts..." : "Nenhum resultado encontrado"}
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
