import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../LoginPage";
import { login } from "../../services/auth";

const mockNavigate = jest.fn();
let mockLocationState: unknown = null;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: mockLocationState }),
}));

jest.mock("../../services/auth", () => ({
  getAuthErrorMessage: jest.fn((_error, fallback) => fallback),
  login: jest.fn(),
}));

const mockedLogin = login as jest.MockedFunction<typeof login>;

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocationState = null;
  });

  it("logs in and navigates to profile", async () => {
    const user = userEvent.setup();
    mockedLogin.mockResolvedValueOnce({ access_token: "token-123" });

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/e-mail/i), "ana@example.com");
    await user.type(screen.getByLabelText(/senha/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith(
        { email: "ana@example.com", password: "password123" },
        true,
      );
      expect(mockNavigate).toHaveBeenCalledWith("/profile", { replace: true });
    });
  });

  it("shows login errors", async () => {
    const user = userEvent.setup();
    mockedLogin.mockRejectedValueOnce(new Error("invalid"));

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/e-mail/i), "ana@example.com");
    await user.type(screen.getByLabelText(/senha/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText("Não foi possível fazer login."),
    ).toBeInTheDocument();
  });

  it("shows the registration success message from navigation state", () => {
    mockLocationState = { message: "Cadastro criado com sucesso. Faça login." };

    render(<LoginPage />);

    expect(
      screen.getByText("Cadastro criado com sucesso. Faça login."),
    ).toBeInTheDocument();
  });
});
