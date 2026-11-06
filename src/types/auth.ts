export interface UsuarioLoginApi {
    id: number;
    nome: string;
    email: string;
    perfil_id: number | string;
    cpf?: string;
    senha?: string;
}

export interface LoginResponse {
    token: string;
    user: UsuarioLoginApi;
}

export interface UsuarioLogado {
    id: number;
    nome: string;
    email: string;
    perfilId: number;
}
