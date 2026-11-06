import { Cores } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import type { DrawerNavigationProp } from "expo-router/drawer";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppHeader() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<DrawerNavigationProp<Record<string, undefined>>>();

    return (
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity
                style={styles.botaoMenu}
                onPress={() => navigation.toggleDrawer()}
                accessibilityRole="button"
                accessibilityLabel="Abrir menu"
            >
                <Ionicons name="menu" size={22} color={Cores.azulMaisClaro} />
            </TouchableOpacity>

            <Image
                source={require("../../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.titulo}>BlogTech</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Cores.azulMaisEscuro,
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    botaoMenu: {
        width: 40,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Cores.azulMaisClaro,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 32,
        height: 32,
        marginLeft: 12,
        borderRadius: 4,
        backgroundColor: "#fff",
    },
    titulo: {
        color: Cores.azulMaisClaro,
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 12,
    },
});
