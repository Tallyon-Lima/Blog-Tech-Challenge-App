import { Alert, Platform } from "react-native";

// Pede confirmação antes de uma ação destrutiva.
// No celular usa o Alert nativo; na web (que não implementa Alert.alert) usa o confirm do navegador.
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
