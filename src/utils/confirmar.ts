import { Alert, Platform } from "react-native";

export function confirmarExclusao(titulo: string, mensagem: string, aoConfirmar: () => void) {
    if (Platform.OS === "web") {
        if (globalThis.confirm?.(`${titulo}\n\n${mensagem}`)) {
            aoConfirmar();
        }
        return;
    }

    Alert.alert(titulo, mensagem, [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: aoConfirmar },
    ]);
}
