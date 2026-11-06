import { Papel, PAPEL_POR_PERFIL_ID, PERFIL_ID_POR_PAPEL } from "@/constants/Papeis";
import type { ListaUsuariosApi, NovoUsuario, Usuario, UsuarioApi, UsuarioRequest } from "@/types/usuarios";
import {
    atualizarUsuario,
    criarUsuario,
    excluirUsuario,
    listarUsuarios,
} from "@/services/users/UsuariosService";
import { ValidationError } from "../Login/Login.controller";

function validarDados(data: NovoUsuario): UsuarioRequest {
    const nome = data.nome.trim();
    const email = data.email.trim();
    const cpf = data.cpf.replace(/\D/g, "");

    if (!nome) {
        throw new ValidationError("Informe o nome do usuário.");
    }

    if (!email) {
        throw new ValidationError("Informe o e-mail do usuário.");
    }

    if (!email.includes("@")) {
        throw new ValidationError("Informe um e-mail válido.");
    }

    if (cpf.length !== 11) {
        throw new ValidationError("Informe um CPF válido com 11 dígitos.");
    }

    const perfilId = PERFIL_ID_POR_PAPEL[data.perfil];

    if (!perfilId) {
        throw new ValidationError("Selecione um perfil.");
    }

    return { nome, email, cpf, perfil_id: perfilId };
}

function converterUsuario(u: UsuarioApi): Usuario {
    return {
        id: u.id,
        nome: u.nome,
        email: u.email,
        cpf: u.cpf,
        papel: PAPEL_POR_PERFIL_ID[String(u.perfil_id)],
    };
}

export async function listarUsuariosController(params: {
    page: number;
    limit: number;
    busca?: string;
    papel?: Papel;
}) {
    const resposta = (await listarUsuarios({
        page: params.page,
        limit: params.limit,
        busca: params.busca?.trim() || undefined,
        perfil_id: params.papel ? PERFIL_ID_POR_PAPEL[params.papel] : undefined,
    })) as ListaUsuariosApi | UsuarioApi[];

    const lista = Array.isArray(resposta) ? resposta : resposta.data ?? [];
    const totalPaginas = Array.isArray(resposta) ? 1 : resposta.totalPages ?? 1;

    return {
        usuarios: lista.map(converterUsuario),
        totalPaginas,
    };
}
export async function criarUsuarioController(data: NovoUsuario) {
    const dadosValidados = validarDados(data);

    return criarUsuario(dadosValidados);
}

export async function atualizarUsuarioController(id: number, data: NovoUsuario) {
    const dadosValidados = validarDados(data);

    return atualizarUsuario(id, dadosValidados);
}

export async function excluirUsuarioController(id: number) {
    if (!id) {
        throw new ValidationError("Usuário inválido.");
    }

    return excluirUsuario(id);
}