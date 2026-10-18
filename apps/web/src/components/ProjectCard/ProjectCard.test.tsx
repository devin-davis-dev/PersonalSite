import { render, screen } from "../../test-utils";
import { TechListing } from "../TechListing/TechListing";
import ProjectCard from "./ProjectCard";

jest.mock("../TechListing/TechListing");

describe("ProjectCard", () => {
  const mockProject = {
    title: "Test Project",
    startDate: "March 2024",
    exerpt: "This is a test excerpt.",
    technologies: [{ name: "Gatsby", image: "" }],
    slug: "/projects/test-project",
    image1: {
      src: "test-image.jpg",
    },
  };

  it("renders project title, date, excerpt, and technologies", () => {
    render(<ProjectCard project={mockProject} />);

    expect(TechListing).toHaveBeenCalledWith(
      {
        technologies: mockProject.technologies,
        descriptive: false,
      },
      expect.anything(),
    );

    const imgEl = screen.getByRole("img", { name: "image 1" });
    expect(imgEl).toBeInTheDocument();
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("March 2024")).toBeInTheDocument();
    expect(screen.getByText("This is a test excerpt.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view/i })).toBeInTheDocument();
  });

  it("renders a link to the project page", () => {
    render(<ProjectCard project={mockProject} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/projects/test-project");
  });

  it("renders with stacked layout when stacked prop is true", () => {
    render(<ProjectCard project={mockProject} stacked />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "image 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view/i })).toBeInTheDocument();
  });

  it("renders with stacked layout when layout is set to stacked", () => {
    render(<ProjectCard project={mockProject} layout="stacked" />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "image 1" })).toBeInTheDocument();
  });

  it("renders status badge when project status is complete or ongoing", () => {
    render(
      <ProjectCard project={{ ...mockProject, status: "complete" }} stacked />,
    );
    expect(screen.getByText(/status_complete/i)).toBeInTheDocument();
  });
});
