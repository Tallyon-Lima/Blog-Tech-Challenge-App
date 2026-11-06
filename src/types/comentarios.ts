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

export interface ComentarioEdicaoRequest extends ComentarioRequest {
    usuario_solicitante: number;
}

export interface Comentario {
    id: number;
    conteudo: string;
    autor: string;
    dataAtualizacao: string;
}
