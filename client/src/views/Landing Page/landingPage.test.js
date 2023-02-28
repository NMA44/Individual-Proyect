import LandingPage from "./landingPage";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter, Link } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Landing Page test", () => {
  test("renders content", () => {
    let landing = render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    expect(landing.container).toHaveTextContent("Dog Breeds");
  });
});
