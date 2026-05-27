import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkbox from "../Checkbox";
import { runAxe } from "../../../test/axeHelper";

describe("Checkbox Accessibility", () => {
  it("should not have accessibility violations", async () => {
    const { container } = render(<Checkbox />);
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("should render as a proper checkbox input", () => {
    const { getByRole } = render(<Checkbox />);
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("type", "checkbox");
  });

  it("should support aria-label for accessibility", () => {
    const { getByRole } = render(<Checkbox aria-label="Accept terms" />);
    const checkbox = getByRole("checkbox", { name: /accept terms/i });
    expect(checkbox).toBeInTheDocument();
  });

  it("should support aria-describedby for additional context", () => {
    const { getByRole } = render(<Checkbox aria-describedby="terms-desc" />);
    const checkbox = getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-describedby", "terms-desc");
  });

  it("should be keyboard accessible", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<Checkbox />);
    const checkbox = getByRole("checkbox");

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("should support checked state", () => {
    const { getByRole } = render(<Checkbox checked={true} readOnly />);
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should support disabled state", () => {
    const { getByRole } = render(<Checkbox disabled />);
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("should have accessible focus visible styles", () => {
    const { getByRole } = render(<Checkbox />);
    const checkbox = getByRole("checkbox");
    expect(checkbox).toHaveClass("focus:ring-primary");
  });

  it("should trigger onChange handler", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const { getByRole } = render(<Checkbox onChange={handleChange} />);
    const checkbox = getByRole("checkbox");

    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });
});
