import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfilePage from "../ProfilePage";
import { clearAuthToken, getAuthToken, getMe } from "../../services/auth";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../services/auth", () => ({
  clearAuthToken: jest.fn(),
  getAuthErrorMessage: jest.fn((_error, fallback) => fallback),
  getAuthToken: jest.fn(),
  getMe: jest.fn(),
}));

const mockedGetAuthToken = getAuthToken as jest.MockedFunction<
  typeof getAuthToken
>;
const mockedGetMe = getMe as jest.MockedFunction<typeof getMe>;
const mockedClearAuthToken = clearAuthToken as jest.MockedFunction<
  typeof clearAuthToken
>;

describe("ProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads and shows the current user", async () => {
    mockedGetAuthToken.mockReturnValue("token-123");
    mockedGetMe.mockResolvedValueOnce({
      id: "1",
      name: "Ana Silva",
      email: "ana@example.com",
    });

    render(<ProfilePage />);

    expect(await screen.findByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
  });

  it("redirects to login when there is no token", () => {
    mockedGetAuthToken.mockReturnValue(null);

    render(<ProfilePage />);

    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("clears the token and redirects when profile request fails", async () => {
    mockedGetAuthToken.mockReturnValue("token-123");
    mockedGetMe.mockRejectedValueOnce(new Error("Unauthorized"));

    render(<ProfilePage />);

    await waitFor(() => {
      expect(mockedClearAuthToken).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
    });
  });

  it("logs out", async () => {
    const user = userEvent.setup();
    mockedGetAuthToken.mockReturnValue("token-123");
    mockedGetMe.mockResolvedValueOnce({
      id: "1",
      name: "Ana Silva",
      email: "ana@example.com",
    });

    render(<ProfilePage />);

    await screen.findByText("Ana Silva");
    await user.click(screen.getByRole("button", { name: /sair/i }));

    expect(mockedClearAuthToken).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});
