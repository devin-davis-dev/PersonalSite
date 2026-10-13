import "@testing-library/jest-dom";

// Standard browser API mocks for JSDOM
window.scrollTo = jest.fn();

if (!navigator.clipboard) {
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: jest.fn().mockResolvedValue(undefined),
    },
    writable: true,
    configurable: true,
  });
}

// Universal mock for gatsby-plugin-react-i18next
jest.mock("gatsby-plugin-react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: jest.fn(), language: "en" },
  }),
  useI18next: () => ({
    language: "en",
    languages: ["en", "fr"],
    changeLanguage: jest.fn(),
  }),
  Link: ({ to, children, ...props }) => {
    const React = require("react");
    return React.createElement("a", { href: to, ...props }, children);
  },
}));

// Universal mock for gatsby-plugin-image
jest.mock("gatsby-plugin-image", () => ({
  StaticImage: ({ alt, ...props }) => {
    const React = require("react");
    return React.createElement("img", {
      alt: alt || "mocked static image",
      ...props,
    });
  },
  GatsbyImage: ({ alt, ...props }) => {
    const React = require("react");
    return React.createElement("img", {
      alt: alt || "mocked gatsby image",
      ...props,
    });
  },
  getImage: jest.fn((image) => image),
  withArtDirection: jest.fn(),
}));
