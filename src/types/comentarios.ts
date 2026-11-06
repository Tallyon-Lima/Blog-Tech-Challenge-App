// Item de GET /posts/:id/comentarios (autor vem como nome, via JOIN)
export interface ComentarioApi {
    id: number;
    conteudo: string;
    post_id: number;
    data_criacao: string;
    data_atualizacao: string;
    autor: string;
}

export interface ComentarioRequest {
    conteudo: string;
    post_id: number;
    autor_id: number;
}

// O PUT exige também quem está solicitando a edição
export interface ComentarioEdicaoRequest extends ComentarioRequest {
    usuario_solicitante: number;
}

// Formato usado pela tela
export interface Comentario {
    id: number;
    conteudo: string;
    autor: string;
    dataAtualizacao: string;
}
