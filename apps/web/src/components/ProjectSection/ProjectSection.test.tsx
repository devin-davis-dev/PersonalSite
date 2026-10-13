import { render, screen } from "../../test-utils";
import { ProjectSection } from "./ProjectSection";

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
