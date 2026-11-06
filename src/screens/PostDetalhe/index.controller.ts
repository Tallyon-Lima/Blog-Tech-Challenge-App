import { PerfilUsuario } from "@/constants/Perfis";
import {
    atualizarComentario,
    criarComentario,
    excluirComentario,
    listarComentarios,
} from "@/services/comentarios/ComentariosService";
import { buscarPostPorId } from "@/services/posts/PostsService";
import { buscarUsuarioPorId } from "@/services/users/UsuariosService";
import type { UsuarioLogado } from "@/types/auth";
import type { Comentario, ComentarioApi } from "@/types/comentarios";
import { ValidationError } from "../Login/Login.controller";

export const LIMITE_COMENTARIO = 255;

export interface DetalhePost {
    id: number;
    titulo: string;
    conteudo: string;
    disciplina: string;
    autorId: number;
    autorNome: string;
    autorPerfilId: number | null;
    dataAtualizacao: string;
}

function converterComentario(c: ComentarioApi): Comentario {
    return {
        id: c.id,
        conteudo: c.conteudo,
        autor: c.autor,
        dataAtualizacao: c.data_atualizacao,
    };
}

function exigirUsuario(usuario: UsuarioLogado | null): UsuarioLogado {
    if (!usuario) {
        throw new ValidationError("Usuário não autenticado. Faça login novamente.");
    }

    return usuario;
}

function validarConteudo(conteudo: string) {
    const texto = conteudo.trim();

    if (!texto) {
        throw new ValidationError("Escreva o comentário.");
    }

    if (texto.length > LIMITE_COMENTARIO) {
        throw new ValidationError(`O comentário deve ter no máximo ${LIMITE_COMENTARIO} caracteres.`);
    }

    return texto;
}

export function podeModificarPostDetalhe(usuario: UsuarioLogado | null, post: DetalhePost | null) {
    if (!usuario || !post) return false;
    if (usuario.perfilId === PerfilUsuario.ADMIN) return true;

    return usuario.perfilId === PerfilUsuario.PROFESSOR && post.autorId === usuario.id;
}

export function podeModificarComentario(
    usuario: UsuarioLogado | null,
    comentario: Comentario,
    post: DetalhePost | null
) {
    if (!usuario) return false;
    if (comentario.autor === usuario.nome) return true;
    if (usuario.perfilId === PerfilUsuario.ADMIN) return true;

    return usuario.perfilId === PerfilUsuario.PROFESSOR && post?.autorId === usuario.id;
}

export async function carregarDetalheController(id: number) {
    const [post, comentarios] = await Promise.all([buscarPostPorId(id), listarComentarios(id)]);

    if (!post?.id) {
        throw new ValidationError("Post não encontrado.");
    }

    let autorNome = "Autor";
    let autorPerfilId: number | null = null;
    try {
        const autor = await buscarUsuarioPorId(Number(post.autor));

        if (autor?.nome) {
            autorNome = autor.nome;
            autorPerfilId = Number(autor.perfil_id);
        }
    } catch {
    }

    const detalhe: DetalhePost = {
        id: post.id,
        titulo: post.titulo,
        conteudo: post.conteudo,
        disciplina: post.disciplina,
        autorId: Number(post.autor),
        autorNome,
        autorPerfilId,
        dataAtualizacao: post.data_atualizacao || post.data_criacao,
    };

    return {
        post: detalhe,
        comentarios: (Array.isArray(comentarios) ? comentarios : []).map(converterComentario),
    };
}

export async function listarComentariosController(postId: number) {
    const comentarios = await listarComentarios(postId);

    return (Array.isArray(comentarios) ? comentarios : []).map(converterComentario);
}

export async function criarComentarioController(
    postId: number,
    conteudo: string,
    usuario: UsuarioLogado | null
) {
    const autor = exigirUsuario(usuario);

    return criarComentario({ conteudo: validarConteudo(conteudo), post_id: postId, autor_id: autor.id });
}

export async function editarComentarioController(
    id: number,
    postId: number,
    conteudo: string,
    usuario: UsuarioLogado | null
) {
    const solicitante = exigirUsuario(usuario);

    return atualizarComentario(id, {
        conteudo: validarConteudo(conteudo),
        post_id: postId,
        autor_id: solicitante.id,
        usuario_solicitante: solicitante.id,
    });
}

export async function excluirComentarioController(id: number, usuario: UsuarioLogado | null) {
    const solicitante = exigirUsuario(usuario);

    return excluirComentario(id, solicitante.id);
}
