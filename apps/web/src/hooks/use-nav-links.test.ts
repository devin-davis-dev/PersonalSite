import { renderHook } from "@testing-library/react";
import { useNavLinks } from "./use-nav-links";

jest.mock("gatsby-plugin-react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        nav_blog: "Blog",
        nav_projects: "Projects",
        nav_about: "About",
        nav_contact: "Contact",
        nav_climbing: "Climbing",
      };
      return translations[key] || key;
    },
  }),
}));

describe("useNavLinks", () => {
  it("returns navigation links with LinkedIn and without Home link", () => {
    const { result } = renderHook(() => useNavLinks());

    expect(result.current).toEqual([
      { to: "/blog", label: "Blog" },
      { to: "/projects", label: "Projects" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/climbing", label: "Climbing" },
      {
        to: "https://www.linkedin.com/in/devin-dev-d-63008412b",
        label: "LinkedIn",
        external: true,
      },
    ]);
  });
});
