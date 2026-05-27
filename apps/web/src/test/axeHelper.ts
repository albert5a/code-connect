import { axe } from "jest-axe";

export async function runAxe(container: HTMLElement) {
  return await axe(container, {
    runOnly: { type: "tag", values: ["wcag2aa"] },
  });
}
