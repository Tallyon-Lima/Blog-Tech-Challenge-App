export function formatarData(dataIso?: string | null) {
    if (!dataIso) return "";

    const data = new Date(dataIso);

    if (Number.isNaN(data.getTime())) return "";

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");

    return `${dia}/${mes}/${data.getFullYear()}`;
}
