// As telas do menu lateral continuam montadas quando o usuário troca de tela.
// Este contador avisa as listas de posts que algo foi criado, editado ou excluído,
// para que recarreguem na próxima vez que ficarem visíveis.
let versao = 0;

export function marcarPostsAlterados() {
    versao += 1;
}

export function versaoDosPosts() {
    return versao;
}
