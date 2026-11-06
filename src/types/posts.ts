export interface PostListaApi {
    id: number;
    titulo: string;
    conteudo: string;
    disciplina: string;
    autor: string;
    data_criacao: string;
    data_atualizacao: string;
}

export interface PostDetalheApi {
    id: number;
    titulo: string;
    conteudo: string;
    disciplina: string;
    autor: number;
    data_criacao: string;
    data_atualizacao: string;
}

export interface PostRequest {
    titulo: string;
    conteudo: string;
    disciplina: string;
    autor: number;
}

export interface Post {
    id: number;
    titulo: string;
    conteudo: string;
    disciplina: string;
    autor: string;
    dataCriacao: string;
    dataAtualizacao: string;
}

export interface PostFormValues {
    titulo: string;
    disciplina: string;
    conteudo: string;
}
