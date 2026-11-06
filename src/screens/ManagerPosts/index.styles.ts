import { Cores } from "@/constants/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: Cores.fundo,
    },

    lista: {
        paddingHorizontal: 14,
        paddingBottom: 30,
    },
    conteudoTopo: {
        paddingTop: 18,
        marginBottom: 6,
    },
    titulo: {
        fontSize: 24,
        fontWeight: "800",
        color: Cores.texto,
    },
    subtitulo: {
        fontSize: 13,
        color: Cores.textoSecundario,
        marginTop: 6,
        marginBottom: 14,
    },

    botaoNovo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Cores.primaria,
        borderRadius: 6,
        paddingVertical: 12,
        gap: 4,
        marginBottom: 14,
    },
    botaoNovoTexto: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },

    campoBusca: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Cores.superficie,
        borderWidth: 1,
        borderColor: Cores.borda,
        borderRadius: 6,
        paddingHorizontal: 12,
        height: 42,
    },
    inputBusca: {
        flex: 1,
        marginLeft: 8,
        fontSize: 13,
        color: Cores.texto,
    },

    card: {
        backgroundColor: Cores.superficie,
        borderWidth: 1,
        borderColor: Cores.borda,
        borderRadius: 8,
        padding: 14,
        marginTop: 12,
    },
    cardTopo: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 8,
    },
    cardTitulo: {
        flex: 1,
        fontSize: 14,
        fontWeight: "700",
        color: Cores.texto,
    },
    badge: {
        backgroundColor: Cores.badgeFundo,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    badgeTexto: {
        fontSize: 10,
        fontWeight: "700",
        color: Cores.badgeTexto,
    },
    cardInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 8,
    },
    cardInfoTexto: {
        flexShrink: 1,
        fontSize: 12,
        color: Cores.textoSecundario,
    },
    acoes: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 12,
    },
    botaoAcao: {
        width: 32,
        height: 32,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Cores.borda,
        backgroundColor: Cores.fundo,
        alignItems: "center",
        justifyContent: "center",
    },
    botaoExcluir: {
        backgroundColor: Cores.perigo,
        borderColor: Cores.perigo,
    },

    vazio: {
        textAlign: "center",
        color: Cores.textoSecundario,
        marginTop: 30,
        fontSize: 13,
    },
    carregando: {
        alignItems: "center",
        marginTop: 30,
    },
});

export default styles;
