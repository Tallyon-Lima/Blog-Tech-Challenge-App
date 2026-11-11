export function juntarSemRepetir<T extends { id: number }>(atual: T[], novos: T[]) {
    const ids = new Set(atual.map(item => item.id));

    return [...atual, ...novos.filter(item => !ids.has(item.id))];
}
