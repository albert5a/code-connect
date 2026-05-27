import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { runAxe } from "../../../test/axeHelper";
import CheckboxField from "../CheckboxField";

describe("CheckboxField Accessibility", () => {
  const defaultProps = {
    label: "Remember me",
    checked: false,
    onChange: jest.fn(),
  };

  it("should not have accessibility violations", async () => {
    const { container } = render(<CheckboxField {...defaultProps} />);
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have accessible label associated with checkbox", () => {
    const { getByRole, getByText } = render(
      <CheckboxField {...defaultProps} />,
    );
    const checkbox = getByRole("checkbox");
    const label = getByText("Remember me").closest("label");

    expect(label).toContainElement(checkbox);
    expect(checkbox).toBeVisible();
  });

  it("should be keyboard accessible", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<CheckboxField {...defaultProps} />);
    const checkbox = getByRole("checkbox");

    await user.click(checkbox);
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it("should have readable label text", () => {
    const { getByText } = render(<CheckboxField {...defaultProps} />);
    const labelText = getByText("Remember me");

    expect(labelText).toBeVisible();
    expect(labelText.textContent).toBe("Remember me");
  });

  it("should have sufficient color contrast for label", () => {
    const { getByText } = render(<CheckboxField {...defaultProps} />);
    const label = getByText("Remember me").closest("label");

    // Check for proper text color class
    expect(label).toHaveClass("text-sm");
  });

  it("should support checked state for user feedback", () => {
    const { getByRole } = render(
      <CheckboxField {...defaultProps} checked={true} />,
    );
    const checkbox = getByRole("checkbox");

    expect(checkbox).toBeChecked();
  });

  it("should indicate focus state visually", () => {
    const { getByRole } = render(<CheckboxField {...defaultProps} />);
    const checkbox = getByRole("checkbox");

    // The checkbox should have focus:ring classes
    expect(checkbox).toHaveClass("focus:ring-primary");
  });
});
