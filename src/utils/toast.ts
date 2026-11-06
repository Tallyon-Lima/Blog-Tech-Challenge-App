import { Alert, Platform, ToastAndroid } from "react-native";

// Toast nativo no Android; nos demais sistemas usa um alerta simples.
export function mostrarMensagem(mensagem: string) {
    if (Platform.OS === "android") {
        ToastAndroid.show(mensagem, ToastAndroid.SHORT);
        return;
    }

    Alert.alert("Blog Tech", mensagem);
}

export function mostrarErro(error: unknown, mensagemPadrao: string) {
    mostrarMensagem(error instanceof Error && error.message ? error.message : mensagemPadrao);
}
