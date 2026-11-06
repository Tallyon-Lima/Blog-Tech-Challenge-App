import { ListaUsuariosApi, UsuarioApi, UsuarioRequest } from "@/types/usuarios";
import { api } from "../../api/api";


export function listarUsuarios(params: {
    page: number;
    limit: number;
    busca?: string;
    perfil_id?: string;
}): Promise<ListaUsuariosApi> {
    const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
    if (params.busca) query.set("busca", params.busca);
    if (params.perfil_id) query.set("perfil_id", params.perfil_id);

    return api(`/usuarios?${query.toString()}`, { method: "GET" });
}

export function criarUsuario(data: UsuarioRequest): Promise<UsuarioApi> {
    return api("/usuarios", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function atualizarUsuario(id: number, data: Partial<UsuarioRequest>): Promise<UsuarioApi> {
    return api(`/usuarios/editar/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export function excluirUsuario(id: number) {
    return api(`/usuarios/${id}`, {
        method: "DELETE",
    });
}

export function buscarUsuarioPorId(id: number): Promise<UsuarioApi> {
    return api(`/usuarios/${id}`, { method: "GET" });
}
