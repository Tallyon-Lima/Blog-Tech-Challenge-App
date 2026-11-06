import { Cores } from "@/constants/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: Cores.fundo,
    },
    conteudoTela: {
        padding: 14,
        paddingBottom: 40,
    },

    barra: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    botaoVoltar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 6,
        paddingRight: 10,
    },
    botaoVoltarTexto: {
        fontSize: 14,
        fontWeight: "600",
        color: Cores.textoSecundario,
    },
    acoesPost: {
        flexDirection: "row",
        gap: 8,
    },
    botaoAcao: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: Cores.borda,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    botaoExcluir: {
        backgroundColor: Cores.perigo,
        borderColor: Cores.perigo,
    },

    artigo: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: Cores.borda,
        borderRadius: 16,
        padding: 18,
    },
    badgeDisciplina: {
        alignSelf: "flex-start",
        backgroundColor: Cores.badgeFundo,
        borderWidth: 1,
        borderColor: "#dbeafe",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    badgeDisciplinaTexto: {
        fontSize: 13,
        fontWeight: "600",
        color: Cores.badgeTexto,
    },
    titulo: {
        fontSize: 28,
        fontWeight: "800",
        color: Cores.texto,
        marginTop: 12,
    },
    autorLinha: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 14,
    },
    autorNome: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1e293b",
    },
    papel: {
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    papelTexto: {
        fontSize: 11,
        fontWeight: "600",
    },
    dataPublicacao: {
        fontSize: 13,
        color: Cores.textoSecundario,
        marginTop: 4,
    },
    linha: {
        borderTopWidth: 1,
        borderTopColor: Cores.borda,
        marginVertical: 16,
    },

    tituloComentarios: {
        fontSize: 20,
        fontWeight: "700",
        color: Cores.texto,
    },
    semComentarios: {
        fontSize: 14,
        color: Cores.textoSuave,
        marginTop: 12,
    },

    novoComentario: {
        marginTop: 4,
    },
    inputComentario: {
        minHeight: 90,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 12,
        backgroundColor: Cores.fundo,
        padding: 12,
        fontSize: 15,
        color: "#1e293b",
    },
    contador: {
        alignSelf: "flex-end",
        fontSize: 11,
        color: Cores.textoSuave,
        marginTop: 4,
    },
    botaoEnviar: {
        alignSelf: "flex-end",
        backgroundColor: Cores.primaria,
        borderRadius: 8,
        paddingHorizontal: 22,
        paddingVertical: 11,
        marginTop: 8,
    },
    botaoEnviarDesabilitado: {
        backgroundColor: Cores.primariaDesabilitada,
    },
    botaoEnviarTexto: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },

    carregando: {
        alignItems: "center",
        marginTop: 60,
        gap: 8,
    },
    textoEstado: {
        fontSize: 13,
        color: Cores.textoSecundario,
        textAlign: "center",
    },
});

export default styles;
