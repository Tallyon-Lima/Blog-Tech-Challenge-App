import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "92%",
    },
    conteudo: {
        paddingHorizontal: 18,
        paddingTop: 20,
    },

    titulo: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 18,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },
    input: {
        height: 42,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        backgroundColor: "#f9fafb",
        paddingHorizontal: 12,
        fontSize: 13,
        color: "#111827",
        marginBottom: 16,
    },

    select: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 42,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
    },
    selectAberto: {
        borderColor: "#2563eb",
    },
    selectTexto: {
        fontSize: 13,
        color: "#111827",
    },
    selectPlaceholder: {
        color: "#6b7280",
    },
    opcoes: {
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

    botaoCriar: {
        height: 40,
        borderRadius: 8,
        backgroundColor: "#2563eb",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    botaoCriarDesabilitado: {
        backgroundColor: "#93b4f8",
    },
    botaoCriarTexto: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },
    botaoCancelar: {
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#bfd3fb",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    botaoCancelarTexto: {
        color: "#2563eb",
        fontSize: 13,
        fontWeight: "600",
    },
});

export default styles;