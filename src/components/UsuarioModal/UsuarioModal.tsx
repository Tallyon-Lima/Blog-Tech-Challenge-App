import { PAPEIS, type Papel } from "@/constants/Papeis";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./UsuarioModal.styles";

export interface NovoUsuario {
    nome: string;
    email: string;
    cpf: string;
    perfil: Papel;
}

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit?: (dados: NovoUsuario) => Promise<void> | void;
    usuario?: NovoUsuario | null;
}

const ALTURA_TELA = Dimensions.get("window").height;

const formatarCpf = (valor: string) => {
    const n = valor.replace(/\D/g, "").slice(0, 11);
    return n
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
};

export default function UsuarioModal({ visible, onClose, onSubmit, usuario }: Props) {
    const insets = useSafeAreaInsets();
    const editando = !!usuario;

    const [montado, setMontado] = useState(visible);
    const translateY = useRef(new Animated.Value(ALTURA_TELA)).current;
    const opacidade = useRef(new Animated.Value(0)).current;

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [perfil, setPerfil] = useState<Papel | null>(null);
    const [perfilAberto, setPerfilAberto] = useState(false);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (visible) {
            setNome(usuario?.nome ?? "");
            setEmail(usuario?.email ?? "");
            setCpf(formatarCpf(usuario?.cpf ?? ""));
            setPerfil(usuario?.perfil ?? null);
            setPerfilAberto(false);
            setSalvando(false);

            setMontado(true);
            Animated.parallel([
                Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.timing(opacidade, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
        } else {
            Keyboard.dismiss();
            Animated.parallel([
                Animated.timing(translateY, { toValue: ALTURA_TELA, duration: 250, useNativeDriver: true }),
                Animated.timing(opacidade, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start(({ finished }) => {
                if (finished) {
                    setMontado(false);
                }
            });
        }
    }, [visible]);

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const formularioValido =
        nome.trim().length > 0 && emailValido && cpf.replace(/\D/g, "").length === 11 && perfil !== null;

    const handleSalvar = async () => {
        if (!formularioValido || salvando || !perfil) return;
        try {
            setSalvando(true);
            await onSubmit?.({ nome: nome.trim(), email: email.trim(), cpf, perfil });
            onClose();
        } finally {
            setSalvando(false);
        }
    };

    const textoBotao = salvando
        ? editando ? "Salvando..." : "Criando..."
        : editando ? "Salvar" : "Criar";

    return (
        <Modal visible={montado} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Animated.View style={[styles.backdrop, { opacity: opacidade }]}>
                    <Pressable style={{ flex: 1 }} onPress={onClose} />
                </Animated.View>

                <Animated.View
                    style={[styles.sheet, { transform: [{ translateY }], paddingBottom: insets.bottom + 16 }]}
                >
                    <ScrollView
                        contentContainerStyle={styles.conteudo}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.titulo}>{editando ? "Editar Usuário" : "Criar Usuário"}</Text>

                        <Text style={styles.label}>Nome do Usuário</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o nome do usuário..."
                            placeholderTextColor="#9ca3af"
                            value={nome}
                            onChangeText={setNome}
                        />

                        <Text style={styles.label}>E-mail do Usuário</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o e-mail do usuário..."
                            placeholderTextColor="#9ca3af"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Text style={styles.label}>CPF do Usuário</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o CPF do usuário..."
                            placeholderTextColor="#9ca3af"
                            value={cpf}
                            onChangeText={(texto) => setCpf(formatarCpf(texto))}
                            keyboardType="numeric"
                            maxLength={14}
                        />

                        <Text style={styles.label}>Perfil</Text>
                        <TouchableOpacity
                            style={[styles.select, perfilAberto && styles.selectAberto]}
                            onPress={() => {
                                Keyboard.dismiss();
                                setPerfilAberto(!perfilAberto);
                            }}
                        >
                            <Text style={[styles.selectTexto, !perfil && styles.selectPlaceholder]}>
                                {perfil ?? "Selecione um perfil"}
                            </Text>
                            <Ionicons name={perfilAberto ? "chevron-up" : "chevron-down"} size={16} color="#374151" />
                        </TouchableOpacity>

                        {perfilAberto && (
                            <View style={styles.opcoes}>
                                {PAPEIS.map((item) => {
                                    const selecionado = item === perfil;
                                    return (
                                        <TouchableOpacity
                                            key={item}
                                            style={[styles.opcao, selecionado && styles.opcaoSelecionada]}
                                            onPress={() => {
                                                setPerfil(item);
                                                setPerfilAberto(false);
                                            }}
                                        >
                                            <Text
                                                style={[styles.opcaoTexto, selecionado && styles.opcaoTextoSelecionada]}
                                            >
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.botaoCriar, (!formularioValido || salvando) && styles.botaoCriarDesabilitado]}
                            onPress={handleSalvar}
                            disabled={!formularioValido || salvando}
                        >
                            <Text style={styles.botaoCriarTexto}>{textoBotao}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
                            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}