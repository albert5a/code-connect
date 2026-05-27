import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../Input";
import { runAxe } from "../../../test/axeHelper";

describe("Input Accessibility", () => {
  it("should not have accessibility violations", async () => {
    const { container } = render(<Input />);
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("should be a proper input element", () => {
    const { getByRole } = render(<Input />);
    const input = getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should support aria-label for accessibility when no visible label", () => {
    const { getByRole } = render(<Input aria-label="Username" />);
    const input = getByRole("textbox", { name: /username/i });
    expect(input).toBeInTheDocument();
  });

  it("should support aria-describedby for helper text", () => {
    const { getByRole } = render(<Input aria-describedby="error-msg" />);
    const input = getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby", "error-msg");
  });

  it("should have accessible focus styles", () => {
    const { getByRole } = render(<Input />);
    const input = getByRole("textbox");
    expect(input).toHaveClass("focus:border-primary");
  });

  it("should support placeholder text", () => {
    const { getByPlaceholderText } = render(<Input placeholder="Enter text" />);
    const input = getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });

  it("should be keyboard accessible", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<Input />);
    const input = getByRole("textbox");

    await user.click(input);
    expect(input).toHaveFocus();

    await user.type(input, "test");
    expect(input).toHaveValue("test");
  });

  it("should support disabled state", () => {
    const { getByRole } = render(<Input disabled />);
    const input = getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("should support type attribute for proper input types", () => {
    const { getByDisplayValue } = render(<Input type="email" />);
    const input = getByDisplayValue("", { selector: 'input[type="email"]' });
    expect(input).toHaveAttribute("type", "email");
  });
});
