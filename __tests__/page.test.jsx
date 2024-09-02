import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../src/app/layout";

describe("Layout", () => {
  it("renders a html", () => {
    render(<Page />);

    const heading = screen.getByRole("heading");

    expect(heading).toBeInTheDocument();
  });
});
