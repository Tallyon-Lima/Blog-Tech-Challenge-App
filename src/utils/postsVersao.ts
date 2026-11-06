let versao = 0;

export function marcarPostsAlterados() {
    versao += 1;
}

export function versaoDosPosts() {
    return versao;
}
