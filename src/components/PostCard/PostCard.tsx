import { Cores } from "@/constants/colors";
import type { Post } from "@/types/posts";
import { formatarData } from "@/utils/data";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    post: Post;
    onPress: () => void;
}

export default function PostCard({ post, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8} accessibilityRole="button">
            <View style={styles.topo}>
                <Text style={styles.autor} numberOfLines={1}>{post.autor ?? "Autor não informado"}</Text>

                {!!post.disciplina && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeTexto}>{post.disciplina}</Text>
                    </View>
                )}
            </View>

            <Text style={styles.titulo}>{post.titulo}</Text>
            <Text style={styles.descricao} numberOfLines={3}>{post.conteudo}</Text>

            <View style={styles.rodape}>
                <View style={styles.data}>
                    <Ionicons name="calendar-outline" size={14} color={Cores.textoSuave} />
                    <Text style={styles.dataTexto}>{formatarData(post.dataAtualizacao)}</Text>
                </View>

                <View style={styles.lerMais}>
                    <Text style={styles.lerMaisTexto}>Ler artigo</Text>
                    <Ionicons name="arrow-forward" size={14} color={Cores.azul} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: Cores.borda,
        borderRadius: 16,
        padding: 18,
        marginTop: 14,
    },
    topo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    autor: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: "#1e293b",
    },
    badge: {
        backgroundColor: "#f1f5f9",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    badgeTexto: {
        fontSize: 12,
        fontWeight: "600",
        color: "#475569",
    },
    titulo: {
        fontSize: 19,
        fontWeight: "700",
        color: Cores.texto,
        marginTop: 14,
    },
    descricao: {
        fontSize: 14,
        lineHeight: 21,
        color: Cores.textoSecundario,
        marginTop: 8,
    },
    rodape: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#f1f5f9",
        marginTop: 16,
        paddingTop: 14,
    },
    data: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dataTexto: {
        fontSize: 13,
        color: Cores.textoSuave,
    },
    lerMais: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    lerMaisTexto: {
        fontSize: 13,
        fontWeight: "600",
        color: Cores.azul,
    },
});
