import { fireEvent, render, screen } from "@testing-library/react";
import { getImage } from "gatsby-plugin-image";
import { TechListing } from "./TechListing";

// Mock GatsbyImage
jest.mock("gatsby-plugin-image", () => ({
  // biome-ignore lint/a11y/useAltText: alt is passed through props
  GatsbyImage: ({ image, alt, ...props }) => (
    <img src={image?.src} alt={alt} {...props} />
  ),
  getImage: jest.fn(),
}));

const mockTechnologies = [
  {
    name: "React",
    image: { src: "react-logo.png" },
  },
  {
    name: "Gatsby",
    image: { src: "gatsby-logo.png" },
  },
];

describe("TechListing", () => {
  beforeEach(() => {
    getImage.mockImplementation((img) => img);
  });

  it("renders tech names and images without onClick", () => {
    render(<TechListing technologies={mockTechnologies} descriptive={true} />);

    for (const tech of mockTechnologies) {
      expect(screen.getByAltText(tech.name)).toBeInTheDocument();
      expect(screen.getByText(tech.name)).toBeInTheDocument();
    }
  });

  it("renders tech items with buttons when onClick is provided", () => {
    const handleClick = jest.fn();
    render(
      <TechListing
        technologies={mockTechnologies}
        onClick={handleClick}
        descriptive={true}
      />,
    );

    for (const tech of mockTechnologies) {
      const item = screen.getByText(tech.name);
      fireEvent.click(item);
      expect(handleClick).toHaveBeenCalledWith(tech);
    }
  });

  it("does not show names when descriptive is false", () => {
    render(<TechListing technologies={mockTechnologies} descriptive={false} />);

    for (const tech of mockTechnologies) {
      expect(screen.queryByText(tech.name)).not.toBeInTheDocument();
      expect(screen.getByAltText(tech.name)).toBeInTheDocument();
    }
  });
});
