import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../RegisterPage";
import { register } from "../../services/auth";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../services/auth", () => ({
  getAuthErrorMessage: jest.fn((_error, fallback) => fallback),
  register: jest.fn(),
}));

const mockedRegister = register as jest.MockedFunction<typeof register>;

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("registers a user without sending confirmPassword and navigates to login", async () => {
    const user = userEvent.setup();
    mockedRegister.mockResolvedValueOnce({
      id: "1",
      name: "Ana Silva",
      email: "ana@example.com",
    });

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome completo/i), "Ana Silva");
    await user.type(screen.getByLabelText(/e-mail/i), "ana@example.com");
    await user.type(screen.getByLabelText(/^senha$/i), "password123");
    await user.type(screen.getByLabelText(/confirmar senha/i), "password123");
    await user.click(screen.getByLabelText(/aceito os termos/i));
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalledWith({
        name: "Ana Silva",
        email: "ana@example.com",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/login", {
        replace: true,
        state: { message: "Cadastro criado com sucesso. Faça login." },
      });
    });
  });

  it("shows API errors", async () => {
    const user = userEvent.setup();
    mockedRegister.mockRejectedValueOnce(new Error("conflict"));

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome completo/i), "Ana Silva");
    await user.type(screen.getByLabelText(/e-mail/i), "ana@example.com");
    await user.type(screen.getByLabelText(/^senha$/i), "password123");
    await user.type(screen.getByLabelText(/confirmar senha/i), "password123");
    await user.click(screen.getByLabelText(/aceito os termos/i));
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(
      await screen.findByText("Não foi possível criar sua conta."),
    ).toBeInTheDocument();
  });
});
