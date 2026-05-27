import { render } from "@testing-library/react";
import Button from "../Button";
import { runAxe } from "../../../test/axeHelper";

describe("Button Accessibility", () => {
  it("should not have accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("should render with proper button role", () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("should have accessible focus styles", () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole("button");
    expect(button).toHaveClass("focus-visible:outline");
  });

  it("should support disabled state with proper attributes", () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);
    const button = getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should accept aria attributes", () => {
    const { getByRole } = render(
      <Button aria-label="Custom label" aria-describedby="help">
        Button
      </Button>,
    );
    const button = getByRole("button", { name: /custom label/i });
    expect(button).toHaveAttribute("aria-describedby", "help");
  });
});
