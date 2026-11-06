import MenuLateral from "@/components/MenuLateral/MenuLateral";
import { Cores } from "@/constants/colors";
import { PerfilUsuario } from "@/constants/Perfis";
import { useAuth } from "@/contexts/AuthContext";
import { Drawer } from "expo-router/drawer";

export default function AppLayout() {
  const { usuario } = useAuth();
  const perfilId = usuario?.perfilId;

  const podeGerenciarPosts = perfilId === PerfilUsuario.PROFESSOR || perfilId === PerfilUsuario.ADMIN;
  const podeGerenciarUsuarios = perfilId === PerfilUsuario.ADMIN;

  return (
    <Drawer
      drawerContent={(props) => <MenuLateral {...props} />}
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: { backgroundColor: Cores.azulMaisEscuro, width: 280 },
      }}
    >
      <Drawer.Screen name="index" />

      <Drawer.Screen name="post/[id]" />

      <Drawer.Protected guard={podeGerenciarPosts}>
        <Drawer.Screen name="manager-posts" />
      </Drawer.Protected>

      <Drawer.Protected guard={podeGerenciarUsuarios}>
        <Drawer.Screen name="manager-users" />
      </Drawer.Protected>
    </Drawer>
  );
}
