import { render, screen } from "@testing-library/react";
import { ProjectSection } from "./ProjectSection";

jest.mock("gatsby-plugin-image", () => ({
  getImage: jest.fn((image) => image),
  // biome-ignore lint/a11y/useAltText: mock for test
  GatsbyImage: jest.fn(({ alt, ...props }) => <img alt={alt} {...props} />),
}));

// TODO need to find out how to mock the image alignment
describe("ProjectSection", () => {
  const mockProject = {
    image1: "test-image-1.jpg",
  };

  it("renders the section with image on the left when alignment is right", () => {
    render(
      <ProjectSection
        alignment="right"
        image={mockProject.image1}
        imageAlt="Test Image"
      >
        <p>Test</p>
      </ProjectSection>,
    );

    const image = screen.getByAltText("Test Image");
    const imageContainer = image.closest("div");

    expect(imageContainer).toHaveStyle("order: 1");
  });
});
