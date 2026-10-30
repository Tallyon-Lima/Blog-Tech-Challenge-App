import {
    login,
    type LoginRequest
} from "../../../services/auth/authService";

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export async function loginController(data: LoginRequest) {
    const email = data.email.trim();
    const senha = data.senha.trim();

    if (!email) {
        throw new ValidationError("Informe o e-mail.");
    }

    if (!senha) {
        throw new ValidationError("Informe a senha.");
    }

    if (!email.includes("@")) {
        throw new ValidationError("Informe um e-mail válido.");
    }

    const response = await login({
        email,
        senha,
    });

    return response;
}