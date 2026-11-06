// Resposta de POST /usuarios/signin
export interface UsuarioLoginApi {
    id: number;
    nome: string;
    email: string;
    perfil_id: number | string;
    cpf?: string;
    // O backend devolve o hash da senha; nunca é guardado no app.
    senha?: string;
}

export interface LoginResponse {
    token: string;
    user: UsuarioLoginApi;
}

// Usuário mantido em sessão no app
export interface UsuarioLogado {
    id: number;
    nome: string;
    email: string;
    perfilId: number;
}
