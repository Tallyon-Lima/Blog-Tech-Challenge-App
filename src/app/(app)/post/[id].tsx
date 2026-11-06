import PostDetalhe from "@/screens/PostDetalhe";
import { useLocalSearchParams } from "expo-router";

export default function PostDetalheRota() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // A key remonta a tela ao trocar de post, evitando mostrar o conteúdo do anterior
  return <PostDetalhe key={id} postId={Number(id)} />;
}
