const API_URL = process.env.EXPO_API_URL;

export async function api(
    endpoint: string,
    options?: RequestInit
) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(options?.body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers,
        },
    });

    const rawText = await response.text();

    let data: any;
    try {
        data = rawText ? JSON.parse(rawText) : {};
    } catch {
        data = { message: rawText };
    }

    if (!response.ok) {
        throw new Error(
            data.message || data.mensagem || "Erro na conexão com a API"
        );
    }

    return data;
}