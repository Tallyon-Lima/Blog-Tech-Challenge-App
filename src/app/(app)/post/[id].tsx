import PostDetalhe from "@/screens/PostDetalhe";
import { useLocalSearchParams } from "expo-router";

export default function PostDetalheRota() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PostDetalhe key={id} postId={Number(id)} />;
}
