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
    topo: {
        paddingTop: 18,
    },
    titulo: {
        fontSize: 28,
        fontWeight: "800",
        color: Cores.texto,
    },
    subtitulo: {
        fontSize: 13,
        color: Cores.textoSecundario,
        marginTop: 6,
        marginBottom: 16,
    },
    campoBusca: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#f1f5f9",
        borderWidth: 1,
        borderColor: "transparent",
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 46,
    },
    campoBuscaFocado: {
        backgroundColor: "#fff",
        borderColor: Cores.borda,
    },
    inputBusca: {
        flex: 1,
        fontSize: 15,
        color: "#1e293b",
    },
    vazio: {
        textAlign: "center",
        color: Cores.textoSuave,
        marginTop: 30,
        fontSize: 15,
    },
    carregando: {
        alignItems: "center",
        marginTop: 30,
    },
});

export default styles;
