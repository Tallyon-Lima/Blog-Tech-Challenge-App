import { definirAoNaoAutorizado } from "@/api/api";
import { PAPEL_POR_PERFIL_ID, type Papel } from "@/constants/Papeis";
import type { LoginResponse, UsuarioLogado } from "@/types/auth";
import { mostrarMensagem } from "@/utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

const CHAVES = {
    token: "token",
    usuario: "usuario",
    perfil: "perfil",
} as const;

interface AuthContextValue {
    usuario: UsuarioLogado | null;
    token: string | null;
    papel: Papel | null;
    autenticado: boolean;
    carregando: boolean;
    registrarSessao: (resposta: LoginResponse) => Promise<void>;
    sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function obterExpiracaoMs(token: string): number | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;

        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const preenchido = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const { exp } = JSON.parse(atob(preenchido)) as { exp?: number };

        return typeof exp === "number" ? exp * 1000 : null;
    } catch {
        return null;
    }
}

function tokenExpirado(token: string) {
    const expiracao = obterExpiracaoMs(token);
    return expiracao !== null && expiracao <= Date.now();
}

function lerUsuarioSalvo(bruto: string | null): UsuarioLogado | null {
    if (!bruto) return null;

    try {
        const dados = JSON.parse(bruto);
        const perfilId = Number(dados.perfilId ?? dados.perfil_id);

        if (!dados.id || !perfilId) return null;

        return {
            id: Number(dados.id),
            nome: String(dados.nome ?? ""),
            email: String(dados.email ?? ""),
            perfilId,
        };
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(true);
    const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

    const limparTemporizador = () => {
        if (temporizador.current) {
            clearTimeout(temporizador.current);
            temporizador.current = null;
        }
    };

    const sair = useCallback(async () => {
        limparTemporizador();
        setUsuario(null);
        setToken(null);
        await AsyncStorage.multiRemove([CHAVES.token, CHAVES.usuario, CHAVES.perfil]);
    }, []);

    const sessaoExpirada = useCallback(async () => {
        await sair();
        mostrarMensagem("Sua sessão expirou. Faça login novamente.");
    }, [sair]);

    const agendarExpiracao = useCallback((novoToken: string) => {
        limparTemporizador();

        const expiracao = obterExpiracaoMs(novoToken);
        if (expiracao === null) return;

        temporizador.current = setTimeout(sessaoExpirada, Math.max(expiracao - Date.now(), 0));
    }, [sessaoExpirada]);

    const registrarSessao = useCallback(async ({ token: novoToken, user }: LoginResponse) => {
        const perfilId = Number(user.perfil_id);

        const logado: UsuarioLogado = {
            id: Number(user.id),
            nome: user.nome,
            email: user.email,
            perfilId,
        };

        await AsyncStorage.multiSet([
            [CHAVES.token, novoToken],
            [CHAVES.usuario, JSON.stringify(logado)],
            [CHAVES.perfil, String(perfilId)],
        ]);

        setToken(novoToken);
        setUsuario(logado);
        agendarExpiracao(novoToken);
    }, [agendarExpiracao]);

    useEffect(() => {
        let ativo = true;

        (async () => {
            const [[, tokenSalvo], [, usuarioSalvo]] = await AsyncStorage.multiGet([
                CHAVES.token,
                CHAVES.usuario,
            ]);

            if (!ativo) return;

            const logado = lerUsuarioSalvo(usuarioSalvo);

            if (tokenSalvo && logado && !tokenExpirado(tokenSalvo)) {
                setToken(tokenSalvo);
                setUsuario(logado);
                agendarExpiracao(tokenSalvo);
            } else if (tokenSalvo || usuarioSalvo) {
                await AsyncStorage.multiRemove([CHAVES.token, CHAVES.usuario, CHAVES.perfil]);
            }

            setCarregando(false);
        })();

        return () => {
            ativo = false;
            limparTemporizador();
        };
    }, [agendarExpiracao]);

    useEffect(() => {
        definirAoNaoAutorizado(sessaoExpirada);
        return () => definirAoNaoAutorizado(null);
    }, [sessaoExpirada]);

    const valor = useMemo<AuthContextValue>(() => ({
        usuario,
        token,
        papel: usuario ? PAPEL_POR_PERFIL_ID[String(usuario.perfilId)] ?? null : null,
        autenticado: !!token && !!usuario,
        carregando,
        registrarSessao,
        sair,
    }), [usuario, token, carregando, registrarSessao, sair]);

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const contexto = useContext(AuthContext);

    if (!contexto) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
    }

    return contexto;
}
