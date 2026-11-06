import BottomSheet from "@/components/BottomSheet/BottomSheet";
import { Cores } from "@/constants/colors";
import { DISCIPLINAS } from "@/constants/Disciplinas";
import type { PostFormValues } from "@/types/posts";
import { mostrarErro } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
    visible: boolean;
    postId?: number | null;
    autorNome: string;
    onClose: () => void;
    carregar: (id: number) => Promise<PostFormValues>;
    onSubmit: (valores: PostFormValues, postId?: number | null) => Promise<void>;
}

export default function PostFormModal({ visible, ...formulario }: Props) {
    return (
        <BottomSheet visible={visible} onClose={formulario.onClose}>
            <FormularioPost {...formulario} />
        </BottomSheet>
    );
}

function FormularioPost({ postId, autorNome, onClose, carregar, onSubmit }: Omit<Props, "visible">) {
    const editando = !!postId;

    const [titulo, setTitulo] = useState("");
    const [disciplina, setDisciplina] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [disciplinaAberta, setDisciplinaAberta] = useState(false);
    const [carregando, setCarregando] = useState(editando);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (!postId) return;

        let ativo = true;

        carregar(postId)
            .then((valores) => {
                if (!ativo) return;
                setTitulo(valores.titulo);
                setDisciplina(valores.disciplina);
                setConteudo(valores.conteudo);
            })
            .catch((error) => {
                if (!ativo) return;
                mostrarErro(error, "Não foi possível carregar o post.");
                onClose();
            })
            .finally(() => {
                if (ativo) setCarregando(false);
            });

        return () => {
            ativo = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    const formularioValido =
        titulo.trim().length > 0 && disciplina.trim().length > 0 && conteudo.trim().length > 0;

    const handleSalvar = async () => {
        if (!formularioValido || salvando || carregando) return;

        try {
            setSalvando(true);
            await onSubmit({ titulo, disciplina, conteudo }, postId);
            onClose();
        } catch {
        } finally {
            setSalvando(false);
        }
    };

    const textoBotao = salvando
        ? editando ? "Salvando..." : "Criando..."
        : editando ? "Salvar" : "Criar";

    return (
        <>
            <Text style={styles.titulo}>{editando ? "Editar Post" : "Criar Post"}</Text>

            {carregando ? (
                <View style={styles.carregando}>
                    <ActivityIndicator color={Cores.primaria} />
                    <Text style={styles.carregandoTexto}>Carregando post...</Text>
                </View>
            ) : (
                <>
                    <Text style={styles.label}>Título</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o título do post..."
                        placeholderTextColor="#9ca3af"
                        value={titulo}
                        onChangeText={setTitulo}
                        maxLength={255}
                    />

                    <Text style={styles.label}>Disciplina</Text>
                    <TouchableOpacity
                        style={[styles.select, disciplinaAberta && styles.selectAberto]}
                        onPress={() => {
                            Keyboard.dismiss();
                            setDisciplinaAberta(!disciplinaAberta);
                        }}
                    >
                        <Text style={[styles.selectTexto, !disciplina && styles.selectPlaceholder]}>
                            {disciplina || "Selecione uma disciplina"}
                        </Text>
                        <Ionicons
                            name={disciplinaAberta ? "chevron-up" : "chevron-down"}
                            size={16}
                            color="#374151"
                        />
                    </TouchableOpacity>

                    {disciplinaAberta && (
                        <ScrollView style={styles.opcoes} nestedScrollEnabled>
                            {DISCIPLINAS.map((item) => {
                                const selecionada = item === disciplina;

                                return (
                                    <TouchableOpacity
                                        key={item}
                                        style={[styles.opcao, selecionada && styles.opcaoSelecionada]}
                                        onPress={() => {
                                            setDisciplina(item);
                                            setDisciplinaAberta(false);
                                        }}
                                    >
                                        <Text
                                            style={[styles.opcaoTexto, selecionada && styles.opcaoTextoSelecionada]}
                                        >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}

                    <Text style={[styles.label, styles.labelEspaco]}>Autor</Text>
                    <TextInput style={[styles.input, styles.inputDesabilitado]} value={autorNome} editable={false} />

                    <Text style={styles.label}>Conteúdo</Text>
                    <TextInput
                        style={[styles.input, styles.inputMultilinha]}
                        placeholder="Escreva o conteúdo do post..."
                        placeholderTextColor="#9ca3af"
                        value={conteudo}
                        onChangeText={setConteudo}
                        multiline
                        textAlignVertical="top"
                    />

                    <TouchableOpacity
                        style={[styles.botaoSalvar, (!formularioValido || salvando) && styles.botaoSalvarDesabilitado]}
                        onPress={handleSalvar}
                        disabled={!formularioValido || salvando}
                    >
                        <Text style={styles.botaoSalvarTexto}>{textoBotao}</Text>
                    </TouchableOpacity>
                </>
            )}

            <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
                <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    titulo: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 18,
    },
    carregando: {
        alignItems: "center",
        paddingVertical: 30,
        gap: 8,
    },
    carregandoTexto: {
        fontSize: 13,
        color: Cores.textoSecundario,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },
    labelEspaco: {
        marginTop: 16,
    },
    input: {
        minHeight: 42,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        backgroundColor: "#f9fafb",
        paddingHorizontal: 12,
        fontSize: 13,
        color: "#111827",
        marginBottom: 16,
    },
    inputDesabilitado: {
        color: Cores.textoSecundario,
        backgroundColor: "#f1f5f9",
    },
    inputMultilinha: {
        minHeight: 140,
        paddingTop: 12,
        paddingBottom: 12,
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
        borderColor: Cores.primaria,
    },
    selectTexto: {
        fontSize: 13,
        color: "#111827",
    },
    selectPlaceholder: {
        color: "#6b7280",
    },
    opcoes: {
        maxHeight: 180,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        marginTop: 4,
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
    botaoSalvar: {
        height: 40,
        borderRadius: 8,
        backgroundColor: Cores.primaria,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
    },
    botaoSalvarDesabilitado: {
        backgroundColor: Cores.primariaDesabilitada,
    },
    botaoSalvarTexto: {
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
        color: Cores.primaria,
        fontSize: 13,
        fontWeight: "600",
    },
});
