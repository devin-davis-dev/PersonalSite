import { renderHook } from "../test-utils";
import { useExternalNavLinks, useNavLinks } from "./use-nav-links";

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
  it("returns internal navigation links in order without Home link", () => {
    const { result } = renderHook(() => useNavLinks());

    expect(result.current).toEqual([
      { to: "/contact", label: "Contact" },
      { to: "/about", label: "About" },
      { to: "/projects", label: "Projects" },
      { to: "/blog", label: "Blog" },
      { to: "/climbing", label: "Climbing" },
    ]);
  });

  it("returns external navigation links including LinkedIn", () => {
    const { result } = renderHook(() => useExternalNavLinks());

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          to: "https://www.linkedin.com/in/devin-dev-d-63008412b",
          label: "LinkedIn",
          external: true,
        }),
      ]),
    );
  });
});
