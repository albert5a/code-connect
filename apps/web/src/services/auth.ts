import { AxiosError } from "axios";
import { apiClient } from "./apiClient";

const AUTH_TOKEN_KEY = "codeConnectAuthToken";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type LoginResponse = {
  access_token: string;
};

type ApiErrorResponse = {
  message?: string | string[];
};

export function saveAuthToken(token: string, remember: boolean) {
  const targetStorage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  targetStorage.setItem(AUTH_TOKEN_KEY, token);
  otherStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getAuthToken() {
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ??
    sessionStorage.getItem(AUTH_TOKEN_KEY)
  );
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function login(payload: LoginPayload, remember: boolean) {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  saveAuthToken(data.access_token, remember);
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await apiClient.post<AuthUser>("/auth/register", payload);
  return data;
}

export async function getMe() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const { data } = await apiClient.get<AuthUser>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const apiMessage = (error.response?.data as ApiErrorResponse | undefined)
      ?.message;

    if (Array.isArray(apiMessage)) {
      return apiMessage.join(" ");
    }

    if (typeof apiMessage === "string") {
      return apiMessage;
    }

    if (status === 401) {
      return "Credenciais inválidas.";
    }

    if (status === 409) {
      return "Email já cadastrado.";
    }

    if (!error.response) {
      return "Não foi possível conectar à API. Tente novamente em instantes.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
