import { Cores } from "@/constants/colors";
import { PerfilUsuario } from "@/constants/Perfis";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import type { DrawerContentComponentProps } from "expo-router/drawer";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ItemMenu {
    rota: "index" | "manager-posts" | "manager-users";
    href: Href;
    titulo: string;
    icone: keyof typeof Ionicons.glyphMap;
    visivel: boolean;
}

export default function MenuLateral({ state, navigation }: DrawerContentComponentProps) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { usuario, papel, sair } = useAuth();

    const perfilId = usuario?.perfilId;
    const rotaAtiva = state.routes[state.index]?.name;

    const itens: ItemMenu[] = [
        { rota: "index", href: "/", titulo: "Home", icone: "home", visivel: true },
        {
            rota: "manager-posts",
            href: "/manager-posts",
            titulo: "Posts",
            icone: "clipboard",
            visivel: perfilId === PerfilUsuario.PROFESSOR || perfilId === PerfilUsuario.ADMIN,
        },
        {
            rota: "manager-users",
            href: "/manager-users",
            titulo: "Usuários",
            icone: "people",
            visivel: perfilId === PerfilUsuario.ADMIN,
        },
    ];

    const abrir = (item: ItemMenu) => {
        navigation.closeDrawer();
        router.navigate(item.href);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.cabecalho}>
                <Image
                    source={require("../../../assets/images/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.titulo}>BlogTech</Text>
            </View>

            <ScrollView style={styles.lista} contentContainerStyle={styles.listaConteudo}>
                {itens.filter((item) => item.visivel).map((item) => {
                    const ativo = rotaAtiva === item.rota;

                    return (
                        <TouchableOpacity
                            key={item.rota}
                            style={[styles.item, ativo && styles.itemAtivo]}
                            onPress={() => abrir(item)}
                            accessibilityRole="button"
                        >
                            <Ionicons
                                name={item.icone}
                                size={22}
                                color={ativo ? Cores.azul : Cores.azulMaisClaro}
                            />
                            <Text style={[styles.itemTexto, ativo && styles.itemTextoAtivo]}>{item.titulo}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.rodape}>
                <Text style={styles.nomeUsuario} numberOfLines={1}>
                    {usuario?.nome || papel || "Usuário"}
                </Text>
                <Text style={styles.papelUsuario}>{papel ?? "Usuário"}</Text>

                <TouchableOpacity style={styles.botaoSair} onPress={sair} accessibilityRole="button">
                    <Ionicons name="log-out-outline" size={18} color={Cores.azulMaisClaro} />
                    <Text style={styles.botaoSairTexto}>Sair</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Cores.azulMaisEscuro,
        paddingHorizontal: 20,
    },
    cabecalho: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    logo: {
        width: 56,
        height: 56,
        borderRadius: 6,
        backgroundColor: "#fff",
    },
    titulo: {
        color: Cores.azulMaisClaro,
        fontSize: 26,
        fontWeight: "700",
    },
    lista: {
        flex: 1,
        marginTop: 30,
    },
    listaConteudo: {
        gap: 10,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: Cores.azul,
    },
    itemAtivo: {
        backgroundColor: Cores.azulClaro,
    },
    itemTexto: {
        color: Cores.azulMaisClaro,
        fontSize: 16,
        fontWeight: "700",
    },
    itemTextoAtivo: {
        color: Cores.azul,
    },
    rodape: {
        borderTopWidth: 1,
        borderTopColor: "rgba(226, 235, 255, 0.15)",
        paddingTop: 14,
        gap: 2,
    },
    nomeUsuario: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    papelUsuario: {
        color: Cores.textoSuave,
        fontSize: 12,
        marginBottom: 12,
    },
    botaoSair: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        height: 40,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(226, 235, 255, 0.25)",
    },
    botaoSairTexto: {
        color: Cores.azulMaisClaro,
        fontSize: 14,
        fontWeight: "600",
    },
});
