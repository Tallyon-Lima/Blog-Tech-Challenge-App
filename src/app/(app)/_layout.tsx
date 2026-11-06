import MenuLateral from "@/components/MenuLateral/MenuLateral";
import { Cores } from "@/constants/colors";
import { PerfilUsuario } from "@/constants/Perfis";
import { useAuth } from "@/contexts/AuthContext";
import { Drawer } from "expo-router/drawer";

export default function AppLayout() {
  const { usuario } = useAuth();
  const perfilId = usuario?.perfilId;

  // Mesmas regras do web: posts para Professor/Admin, usuários só para Admin
  const podeGerenciarPosts = perfilId === PerfilUsuario.PROFESSOR || perfilId === PerfilUsuario.ADMIN;
  const podeGerenciarUsuarios = perfilId === PerfilUsuario.ADMIN;

  return (
    <Drawer
      drawerContent={(props) => <MenuLateral {...props} />}
      // "Voltar" retorna à tela anterior (ex.: do detalhe para a lista de onde veio)
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: { backgroundColor: Cores.azulMaisEscuro, width: 280 },
      }}
    >
      <Drawer.Screen name="index" />

      {/* Detalhe do post: aberto a partir das listas, não aparece no menu */}
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
