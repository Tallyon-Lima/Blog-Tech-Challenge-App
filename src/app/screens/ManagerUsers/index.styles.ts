import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: "#f3f4f6",
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1f2937",
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    botaoMenu: {
        width: 38,
        height: 38,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#9ca3af",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 34,
        height: 34,
        marginLeft: 14,
        borderRadius: 6,
    },
    headerTitulo: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 8,
    },

    // Conteúdo
    lista: {
        paddingHorizontal: 14,
        paddingBottom: 30,
    },
    conteudoTopo: {
        paddingTop: 18,
        marginBottom: 6,
    },
    titulo: {
        fontSize: 20,
        fontWeight: "800",
        color: "#111827",
    },
    subtitulo: {
        fontSize: 12,
        color: "#6b7280",
        textAlign: "center",
        marginTop: 8,
        marginBottom: 14,
    },

    botaoNovo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2563eb",
        borderRadius: 8,
        paddingVertical: 12,
        gap: 4,
        marginBottom: 18,
    },
    botaoNovoTexto: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },

    campoBusca: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 42,
        marginBottom: 12,
    },
    inputBusca: {
        flex: 1,
        marginLeft: 8,
        fontSize: 13,
        color: "#111827",
    },

    select: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 42,
    },
    selectAberto: {
        borderColor: "#2563eb",
    },
    selectTexto: {
        fontSize: 13,
        color: "#111827",
    },
    opcoes: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        marginTop: 4,
        overflow: "hidden",
    },
    opcao: {
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    opcaoSelecionada: {
        backgroundColor: "#1d6fdc",
    },
    opcaoTexto: {
        fontSize: 13,
        color: "#111827",
    },
    opcaoTextoSelecionada: {
        color: "#fff",
        fontWeight: "600",
    },

    // Cards
    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        padding: 14,
        marginTop: 12,
    },
    cardTopo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    cardNome: {
        flex: 1,
        fontSize: 13,
        fontWeight: "700",
        color: "#111827",
    },
    badge: {
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    badgeTexto: {
        fontSize: 10,
        fontWeight: "700",
    },
    cardEmail: {
        fontSize: 12,
        color: "#4b5563",
        marginTop: 10,
    },
    acoes: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 10,
    },
    botaoAcao: {
        width: 30,
        height: 30,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#d1d5db",
        backgroundColor: "#f9fafb",
        alignItems: "center",
        justifyContent: "center",
    },
    botaoExcluir: {
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
    },

    vazio: {
        textAlign: "center",
        color: "#6b7280",
        marginTop: 30,
        fontSize: 13,
    },
    carregando: {
        alignItems: "center",
        marginTop: 30,
        gap: 8,
    },
});

export default styles;