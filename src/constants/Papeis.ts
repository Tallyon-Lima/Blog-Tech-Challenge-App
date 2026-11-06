
export const PAPEIS = ["Professor", "Aluno", "Administrador"] as const;
export type Papel = (typeof PAPEIS)[number];

export const TODOS_PAPEIS = "Todos os Papéis";
export const OPCOES_FILTRO_PAPEL = [TODOS_PAPEIS, ...PAPEIS] as const;
export type FiltroPapel = (typeof OPCOES_FILTRO_PAPEL)[number];

export const CORES_PAPEL: Record<Papel, { fundo: string; texto: string }> = {
    Administrador: { fundo: "#E7F8F0", texto: "#0E9F6E" },
    Professor: { fundo: "#E8EFFB", texto: "#3B6FD4" },
    Aluno: { fundo: "#E3F7EC", texto: "#10A56A" },
};
export const COR_PAPEL_PADRAO = { fundo: "#F3F4F6", texto: "#6B7280" };

export const PAPEL_POR_PERFIL_ID: Record<string, Papel> = {
    "1": "Aluno",
    "2": "Professor",
    "3": "Administrador",
};

export const PERFIL_ID_POR_PAPEL = Object.fromEntries(
    Object.entries(PAPEL_POR_PERFIL_ID).map(([id, papel]) => [papel, id])
) as Record<Papel, string>;