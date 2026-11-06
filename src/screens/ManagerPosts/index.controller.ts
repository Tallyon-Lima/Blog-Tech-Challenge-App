import { PerfilUsuario } from "@/constants/Perfis";
import type { UsuarioLogado } from "@/types/auth";
import type { Post, PostFormValues, PostListaApi } from "@/types/posts";
import {
    atualizarPost,
    buscarPostPorId,
    criarPost,
    excluirPost,
    listarPosts,
} from "@/services/posts/PostsService";
import { ValidationError } from "../Login/Login.controller";

function converterPost(p: PostListaApi): Post {
    return {
        id: p.id,
        titulo: p.titulo,
        conteudo: p.conteudo,
        disciplina: p.disciplina,
        autor: p.autor,
        dataCriacao: p.data_criacao,
        dataAtualizacao: p.data_atualizacao,
    };
}

function validarDados(valores: PostFormValues) {
    const titulo = valores.titulo.trim();
    const conteudo = valores.conteudo.trim();
    const disciplina = valores.disciplina.trim();

    if (!titulo) {
        throw new ValidationError("Informe o título do post.");
    }

    if (!disciplina) {
        throw new ValidationError("Selecione a disciplina do post.");
    }

    if (!conteudo) {
        throw new ValidationError("Informe o conteúdo do post.");
    }

    return { titulo, conteudo, disciplina };
}

function exigirUsuario(usuario: UsuarioLogado | null): UsuarioLogado {
    if (!usuario) {
        throw new ValidationError("Usuário não autenticado. Faça login novamente.");
    }

    return usuario;
}

export function podeModificarPost(usuario: UsuarioLogado | null, post: Post) {
    if (!usuario) return false;
    if (usuario.perfilId === PerfilUsuario.ADMIN) return true;

    return usuario.perfilId === PerfilUsuario.PROFESSOR && post.autor === usuario.nome;
}

export async function listarPostsController(params: {
    paginaAtual: number;
    itensPagina: number;
    pesquisa?: string;
}) {
    const resposta = await listarPosts({
        paginaAtual: params.paginaAtual,
        itensPagina: params.itensPagina,
        pesquisa: params.pesquisa?.trim() || undefined,
    });

    const lista = Array.isArray(resposta) ? resposta : [];

    return {
        posts: lista.map(converterPost),
        temMais: lista.length >= params.itensPagina,
    };
}

export async function carregarPostController(id: number): Promise<PostFormValues> {
    const post = await buscarPostPorId(id);

    if (!post?.id) {
        throw new ValidationError("Post não encontrado.");
    }

    return {
        titulo: post.titulo,
        disciplina: post.disciplina,
        conteudo: post.conteudo,
    };
}

export async function criarPostController(valores: PostFormValues, usuario: UsuarioLogado | null) {
    const autor = exigirUsuario(usuario);

    return criarPost({ ...validarDados(valores), autor: autor.id });
}

export async function atualizarPostController(
    id: number,
    valores: PostFormValues,
    usuario: UsuarioLogado | null
) {
    exigirUsuario(usuario);

    const dados = validarDados(valores);

    const original = await buscarPostPorId(id);

    if (!original?.id) {
        throw new ValidationError("Post não encontrado.");
    }

    return atualizarPost(id, { ...dados, autor: original.autor });
}

export async function excluirPostController(id: number, usuario: UsuarioLogado | null) {
    const autor = exigirUsuario(usuario);

    return excluirPost(id, autor.id);
}
