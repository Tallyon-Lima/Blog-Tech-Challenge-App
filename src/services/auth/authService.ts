import type { LoginResponse } from "@/types/auth";
import { api } from "../../api/api";

export interface LoginRequest {
    email: string;
    senha: string;
}

export function login(data: LoginRequest): Promise<LoginResponse> {
    return api("/usuarios/signin", {
        method: "POST",
        body: JSON.stringify(data),
    });
}
