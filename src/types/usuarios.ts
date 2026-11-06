import type { Papel } from "@/constants/Papeis";

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    papel: Papel;
}

export interface NovoUsuario {
    nome: string;
    email: string;
    cpf: string;
    perfil: Papel;
}

export interface ListaUsuariosApi {
    data: UsuarioApi[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface UsuarioApi {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    perfil_id: string;
}

export interface UsuarioRequest {
    nome: string;
    email: string;
    cpf: string;
    perfil_id: string;
}