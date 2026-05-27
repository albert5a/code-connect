import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormField from "../FormField";
import { runAxe } from "../../../test/axeHelper";

describe("FormField Accessibility", () => {
  const defaultProps = {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "your@email.com",
    value: "",
    onChange: jest.fn(),
  };

  it("should not have accessibility violations", async () => {
    const { container } = render(<FormField {...defaultProps} />);
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have properly associated label and input", () => {
    const { getByText, getByRole } = render(<FormField {...defaultProps} />);
    const label = getByText("Email");
    const input = getByRole("textbox");

    expect(label).toHaveAttribute("for", "email");
    expect(input).toHaveAttribute("id", "email");
  });

  it("should be keyboard accessible", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<FormField {...defaultProps} />);
    const input = getByRole("textbox");

    await user.click(input);
    expect(input).toHaveFocus();

    await user.type(input, "test@email.com");
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it("should support different input types", () => {
    const { getByDisplayValue } = render(
      <FormField
        {...defaultProps}
        type="password"
        id="password"
        label="Password"
      />,
    );
    const input = getByDisplayValue("", { selector: 'input[type="password"]' });
    expect(input).toHaveAttribute("type", "password");
  });

  it("should have semantic label structure", () => {
    const { getByText, getByRole } = render(<FormField {...defaultProps} />);
    const label = getByText("Email");
    const input = getByRole("textbox");

    // Label should be properly structured
    expect(label.tagName).toBe("LABEL");
    expect(label).toContainElement(input.parentElement);
  });

  it("should have proper color contrast for label", () => {
    const { getByText } = render(<FormField {...defaultProps} />);
    const label = getByText("Email");

    // Check for sufficient contrast classes
    expect(label).toHaveClass("text-neutral-text");
  });
});
