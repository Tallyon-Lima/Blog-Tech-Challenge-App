import { useEffect, useState, type ReactNode } from "react";
import {
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
}

const ALTURA_TELA = Dimensions.get("window").height;

export default function BottomSheet({ visible, onClose, children }: Props) {
    const insets = useSafeAreaInsets();

    const [montado, setMontado] = useState(false);
    const [translateY] = useState(() => new Animated.Value(ALTURA_TELA));
    const [opacidade] = useState(() => new Animated.Value(0));

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.timing(opacidade, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start(({ finished }) => {
                if (finished) {
                    setMontado(true);
                }
            });
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
    }, [visible, translateY, opacidade]);

    return (
        <Modal visible={visible || montado} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
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
                        {children}
                    </ScrollView>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

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
});
