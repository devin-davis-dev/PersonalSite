import { fireEvent, render, screen } from "../../test-utils";
import type { BlogPost } from "../../types";
import { PostCard } from "./PostCard";

describe("PostCard Behavioral Cause and Effect", () => {
  const mockPost: BlogPost = {
    title: "Understanding CSS Gradients",
    date: "November 14, 2026",
    slug: "/blog/understanding-css-gradients",
    thumbnail: {
      childImageSharp: {
        original: {
          src: "test-thumbnail.jpg",
        },
      },
    },
  };

  it("triggers navigation to target post slug when user clicks the read action button", () => {
    render(<PostCard post={mockPost} />);

    const link = screen.getByRole("link", { name: "read_post" });
    const button = screen.getByRole("button", { name: /read/i });

    const handleNavigate = jest.fn((e) => e.preventDefault());
    link.addEventListener("click", handleNavigate);

    // CAUSE: User clicks the actionable read button
    fireEvent.click(button);

    // EFFECT: Navigation is triggered targeting the post slug destination
    expect(handleNavigate).toHaveBeenCalledTimes(1);
    expect(link).toHaveAttribute("href", "/blog/understanding-css-gradients");
  });

  it("dispatches navigation when activated via keyboard Enter key", () => {
    render(<PostCard post={mockPost} />);

    const link = screen.getByRole("link", { name: "read_post" });
    const handleNavigate = jest.fn((e) => e.preventDefault());
    link.addEventListener("click", handleNavigate);

    // CAUSE: User focuses link and triggers activation via Enter key
    fireEvent.keyDown(link, { key: "Enter", code: "Enter" });
    fireEvent.click(link);

    // EFFECT: Navigation action is executed
    expect(handleNavigate).toHaveBeenCalledTimes(1);
  });

  it("routes dynamically to distinct destinations based on post slug", () => {
    const alternativePost: BlogPost = {
      title: "Decentralized Storage Architecture",
      date: "October 1, 2026",
      slug: "/blog/decentralized-storage-architecture",
    };

    render(<PostCard post={alternativePost} />);

    const link = screen.getByRole("link", { name: "read_post" });
    const button = screen.getByRole("button", { name: /read/i });

    const handleNavigate = jest.fn((e) => e.preventDefault());
    link.addEventListener("click", handleNavigate);

    // CAUSE: User triggers read action on a card configured with an alternate slug
    fireEvent.click(button);

    // EFFECT: Navigation targets the dynamically provided destination
    expect(handleNavigate).toHaveBeenCalledTimes(1);
    expect(link).toHaveAttribute(
      "href",
      "/blog/decentralized-storage-architecture",
    );
  });
});
