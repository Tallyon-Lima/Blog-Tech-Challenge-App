import { Cores } from "@/constants/colors";
import type { Comentario } from "@/types/comentarios";
import { formatarData } from "@/utils/data";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
    comentario: Comentario;
    podeModificar: boolean;
    onEditar: (id: number, conteudo: string) => Promise<void>;
    onExcluir: (id: number) => void;
}

export default function ComentarioItem({ comentario, podeModificar, onEditar, onExcluir }: Props) {
    const [editando, setEditando] = useState(false);
    const [texto, setTexto] = useState(comentario.conteudo);
    const [salvando, setSalvando] = useState(false);

    const iniciarEdicao = () => {
        setTexto(comentario.conteudo);
        setEditando(true);
    };

    const salvar = async () => {
        if (salvando) return;

        if (texto.trim() === comentario.conteudo) {
            setEditando(false);
            return;
        }

        try {
            setSalvando(true);
            await onEditar(comentario.id, texto);
            setEditando(false);
        } catch {
        } finally {
            setSalvando(false);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.topo}>
                <Text style={styles.autor} numberOfLines={1}>{comentario.autor}</Text>

                <View style={styles.meta}>
                    <Text style={styles.data}>{formatarData(comentario.dataAtualizacao)}</Text>

                    {podeModificar && !editando && (
                        <>
                            <TouchableOpacity onPress={iniciarEdicao} style={styles.botaoIcone} accessibilityLabel="Editar comentário">
                                <Ionicons name="pencil" size={14} color={Cores.textoSuave} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => onExcluir(comentario.id)}
                                style={styles.botaoIcone}
                                accessibilityLabel="Excluir comentário"
                            >
                                <Ionicons name="trash" size={14} color={Cores.perigo} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {editando ? (
                <View>
                    <TextInput
                        style={styles.input}
                        value={texto}
                        onChangeText={setTexto}
                        multiline
                        maxLength={255}
                        textAlignVertical="top"
                    />

                    <View style={styles.acoesEdicao}>
                        <TouchableOpacity
                            style={[styles.botaoSalvar, (salvando || !texto.trim()) && styles.botaoDesabilitado]}
                            onPress={salvar}
                            disabled={salvando || !texto.trim()}
                        >
                            <Text style={styles.botaoSalvarTexto}>{salvando ? "Salvando..." : "Salvar"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botaoCancelar} onPress={() => setEditando(false)}>
                            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Text style={styles.conteudo}>{comentario.conteudo}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: Cores.borda,
        borderRadius: 12,
        padding: 14,
        marginTop: 10,
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
        fontWeight: "700",
        color: Cores.texto,
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    data: {
        fontSize: 12,
        color: Cores.textoSecundario,
    },
    botaoIcone: {
        padding: 6,
    },
    conteudo: {
        fontSize: 15,
        lineHeight: 22,
        color: "#334155",
        marginTop: 8,
    },
    input: {
        minHeight: 80,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 6,
        backgroundColor: "#fff",
        padding: 10,
        marginTop: 10,
        fontSize: 14,
        color: "#334155",
    },
    acoesEdicao: {
        flexDirection: "row",
        gap: 8,
        marginTop: 10,
    },
    botaoSalvar: {
        backgroundColor: "#3b82f6",
        borderRadius: 4,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    botaoDesabilitado: {
        opacity: 0.6,
    },
    botaoSalvarTexto: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    botaoCancelar: {
        backgroundColor: "#e2e8f0",
        borderRadius: 4,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    botaoCancelarTexto: {
        color: "#475569",
        fontSize: 12,
        fontWeight: "600",
    },
});
