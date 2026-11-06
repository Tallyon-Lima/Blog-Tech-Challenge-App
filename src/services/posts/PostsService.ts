import type { PostDetalheApi, PostListaApi, PostRequest } from "@/types/posts";
import { api } from "../../api/api";

export function listarPosts(params: {
    paginaAtual: number;
    itensPagina: number;
    pesquisa?: string;
}): Promise<PostListaApi[]> {
    const query = new URLSearchParams({
        paginaAtual: String(params.paginaAtual),
        itensPagina: String(params.itensPagina),
    });

    // Com termo de busca usa o endpoint de pesquisa; sem termo, a listagem normal
    if (params.pesquisa) {
        query.set("pesquisa", params.pesquisa);
        return api(`/posts/search?${query.toString()}`, { method: "GET" });
    }

    return api(`/posts?${query.toString()}`, { method: "GET" });
}

export function buscarPostPorId(id: number): Promise<PostDetalheApi> {
    return api(`/posts/${id}`, { method: "GET" });
}

export function criarPost(data: PostRequest) {
    return api("/posts", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function atualizarPost(id: number, data: PostRequest) {
    return api(`/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// O backend exige o id do solicitante no corpo do DELETE
export function excluirPost(id: number, autor: number) {
    return api(`/posts/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ autor }),
    });
}
