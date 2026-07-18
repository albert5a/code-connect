import { AxiosError } from "axios";
import { apiClient } from "../apiClient";
import {
  clearAuthToken,
  getAuthErrorMessage,
  getAuthToken,
  getMe,
  login,
  register,
} from "../auth";

jest.mock("../apiClient", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("auth service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("logs in, calls the API, and stores the token in localStorage when remembered", async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: { access_token: "token-123" },
    });

    await login({ email: "ana@example.com", password: "password123" }, true);

    expect(mockedApiClient.post).toHaveBeenCalledWith("/auth/login", {
      email: "ana@example.com",
      password: "password123",
    });
    expect(localStorage.getItem("codeConnectAuthToken")).toBe("token-123");
    expect(sessionStorage.getItem("codeConnectAuthToken")).toBeNull();
  });

  it("stores the token in sessionStorage when not remembered", async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: { access_token: "token-456" },
    });

    await login({ email: "ana@example.com", password: "password123" }, false);

    expect(sessionStorage.getItem("codeConnectAuthToken")).toBe("token-456");
    expect(localStorage.getItem("codeConnectAuthToken")).toBeNull();
  });

  it("registers with the API without confirmPassword", async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: { id: "1", name: "Ana", email: "ana@example.com" },
    });

    await register({
      name: "Ana",
      email: "ana@example.com",
      password: "password123",
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith("/auth/register", {
      name: "Ana",
      email: "ana@example.com",
      password: "password123",
    });
  });

  it("gets the current user with a bearer token", async () => {
    localStorage.setItem("codeConnectAuthToken", "token-123");
    mockedApiClient.get.mockResolvedValueOnce({
      data: { id: "1", name: "Ana", email: "ana@example.com" },
    });

    await expect(getMe()).resolves.toEqual({
      id: "1",
      name: "Ana",
      email: "ana@example.com",
    });
    expect(mockedApiClient.get).toHaveBeenCalledWith("/auth/me", {
      headers: { Authorization: "Bearer token-123" },
    });
  });

  it("clears tokens from both storages", () => {
    localStorage.setItem("codeConnectAuthToken", "local-token");
    sessionStorage.setItem("codeConnectAuthToken", "session-token");

    clearAuthToken();

    expect(getAuthToken()).toBeNull();
  });

  it("maps auth and network errors to friendly messages", () => {
    const unauthorized = new AxiosError(
      "Unauthorized",
      undefined,
      undefined,
      undefined,
      {
        status: 401,
        statusText: "Unauthorized",
        data: {},
        headers: {},
        config: {} as never,
      },
    );
    const conflict = new AxiosError(
      "Conflict",
      undefined,
      undefined,
      undefined,
      {
        status: 409,
        statusText: "Conflict",
        data: {},
        headers: {},
        config: {} as never,
      },
    );
    const network = new AxiosError("Network Error");

    expect(getAuthErrorMessage(unauthorized, "fallback")).toBe(
      "Credenciais inválidas.",
    );
    expect(getAuthErrorMessage(conflict, "fallback")).toBe(
      "Email já cadastrado.",
    );
    expect(getAuthErrorMessage(network, "fallback")).toBe(
      "Não foi possível conectar à API. Tente novamente em instantes.",
    );
  });
});
