import type { ComentarioApi, ComentarioEdicaoRequest, ComentarioRequest } from "@/types/comentarios";
import { api } from "../../api/api";

export function listarComentarios(postId: number): Promise<ComentarioApi[]> {
    return api(`/posts/${postId}/comentarios`, { method: "GET" });
}

export function criarComentario(data: ComentarioRequest) {
    return api("/comentarios", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function atualizarComentario(id: number, data: ComentarioEdicaoRequest) {
    return api(`/comentarios/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// O backend exige o id do solicitante no corpo do DELETE
export function excluirComentario(id: number, usuarioSolicitante: number) {
    return api(`/comentarios/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ usuario_solicitante: usuarioSolicitante }),
    });
}
