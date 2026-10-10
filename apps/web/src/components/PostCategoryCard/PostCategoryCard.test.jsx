import { render, screen } from "@testing-library/react";
import PostCategoryCard from "../PostCategoryCard/PostCategoryCard";

describe("PostCategoryCard", () => {
  const mockCategory = {
    title: "Test Category",
    content: "This is a test content.",
    link: "/blog/test-category",
  };

  it("renders category title, content, and link", () => {
    render(<PostCategoryCard {...mockCategory} />);
    expect(screen.getByText("Test Category")).toBeInTheDocument();
    expect(screen.getByText("This is a test content.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read/i })).toHaveAttribute(
      "href",
      "/blog/test-category",
    );
  });
});
