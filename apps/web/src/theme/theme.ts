import { tailwind } from "@theme-ui/presets";
import nightOwl from "@theme-ui/prism/presets/night-owl.json";
import type { Theme } from "theme-ui";

export const colors = {
  primary: "#292E29",
  darkOrange: "#9C4A00",
  secondary: "#eeeeee",
  orange: "#FFA630",
  lightOrange: "#FFA63050",
  white: "#f5f5f5",
  blue: "#2A5F6A",
  success: "#4CAF50",
  error: "#E53E3E",
};

const theme: Theme & Record<string, any> = {
  ...tailwind,
  colors,
  fonts: {
    body: "'Raleway', sans-serif",
    heading: "'Raleway', sans-serif",
    monospace: "Menlo, monospace",
  },
  fontSizes: [
    "1rem", // 16px (base size)
    "1.125rem", // 18px
    "1.25rem", // 20px
    "1.5rem", // 24px
    "1.875rem", // 28px
    "2.875rem", // 30px
  ],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  text: {
    ...((tailwind as any).text || {}),
    hero: {
      color: "primary",
      fontFamily: "heading",
      lineHeight: "heading",
      fontSize: 5,
      mb: 3,
    },
    subheading1: {
      color: "primary",
      fontFamily: "heading",
      lineHeight: "heading",
      fontSize: 4,
      mb: 3,
    },
    subheading2: {
      color: "primary",
      fontFamily: "heading",
      lineHeight: "heading",
      fontSize: 3,
      mb: 3,
    },
    small: {
      color: "primary",
      fontSize: 1,
      lineHeight: "body",
    },
    regular: {
      color: "primary",
      fontSize: 2,
      lineHeight: "body",
    },
    large: {
      fontSize: 3,
      color: "primary",
      fontWeight: "bold",
      lineHeight: "heading",
    },
  },
  styles: {
    ...tailwind.styles,
    code: {
      ...nightOwl,
    },
    inlineCode: {
      fontFamily: "monospace",
      fontSize: "0.875em",
      color: "primary",
      bg: "secondary",
      px: "0.35em",
      py: "0.15em",
      borderRadius: "4px",
    },
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
    },
    h1: {
      fontSize: [5, 6, 7],
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
    h2: {
      fontSize: "2em",
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
    h3: { fontSize: "1.5em", fontStyle: "italic" },
    ul: { marginLeft: "40px", overflowWrap: "break-word" },
    ol: { marginLeft: "40px", overflowWrap: "break-word" },
    li: { listStyleType: "dot", mb: 2 },
    blockquote: { fontStyle: "italic" },
    a: { color: "orange" },
    p: {
      color: "primary",
      fontSize: 1,
      lineHeight: "body",
    },
    em: {
      fontStyle: "italic",
    },
    b: {
      fontWeight: 800,
    },
    img: {
      marginBottom: "1px",
    },
  },
  headings: {
    h1: {
      fontSize: [5, 6, 7],
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
    h2: {
      fontSize: [4, 5, 6],
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
  },
  links: {
    text: {
      color: "blue",
      fontWeight: "bold",
      textDecoration: "underline",
      "&:hover": {
        color: "#E07A5F",
        textDecoration: "underline",
      },
      "&:focus": {
        color: "#3D405B",
        outline: "2px solid #3D405B",
        outlineOffset: "2px",
      },
      "&:active": {
        color: "#F2CC8F",
        textDecoration: "none",
      },
    },
    mobileNav: {
      color: "primary",
    },
    footer: {
      color: "white",
      textDecoration: "none",
      a: {
        color: "orange",
      },
      "&:visited": {
        color: "white",
      },
      "&:hover": {
        color: "orange",
        textDecoration: "underline",
      },
      "&:focus": {
        color: "#3D405B",
        outline: "2px solid #3D405B",
        outlineOffset: "2px",
      },
      "&:active": {
        color: "#F2CC8F",
        textDecoration: "none",
      },
    },
    nav: {
      fontFamily: "body",
      fontWeight: "bold",
      color: "#FFFFFF",
      textDecoration: "none",
      "&:hover": {
        color: "orange",
        textDecoration: "underline",
      },
      "&:focus": {
        color: "#3D405B",
        outline: "2px solid #3D405B",
        outlineOffset: "2px",
      },
      "&:active": {
        color: "#F2CC8F",
        textDecoration: "none",
      },
    },
  },
  cards: {
    project: {
      bg: "primary",
      color: "white",
      padding: 3,
      borderRadius: 3,
    },
  },
  buttons: {
    primary: {
      fontFamily: "body",
      fontWeight: "bold",
      fontSize: ["0.9375rem", "1rem"],
      color: "#1A1A1A",
      bg: "orange",
      cursor: "pointer",
      userSelect: "none",
      borderRadius: "8px",
      border: "2px solid transparent",
      px: ["12px", "16px"],
      py: ["8px", "10px"],
      minHeight: ["44px", "40px"],
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        bg: "white",
        borderColor: "orange",
        color: "#1A1A1A",
        boxShadow: "0 4px 12px rgba(255, 166, 48, 0.35)",
        transform: "translateY(-1px)",
      },
      "&:active": {
        transform: "translateY(0) scale(0.98)",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      },
      "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "orange",
        outlineOffset: "2px",
      },
      "&:disabled": {
        opacity: 0.6,
        cursor: "not-allowed",
        backgroundColor: "lightgray",
        boxShadow: "none",
        transform: "none",
      },
    },
    secondary: {
      fontFamily: "body",
      fontWeight: "bold",
      fontSize: ["0.875rem", "0.9375rem"],
      color: "primary",
      bg: "secondary",
      cursor: "pointer",
      userSelect: "none",
      borderRadius: "8px",
      border: "2px solid transparent",
      px: ["12px", "16px"],
      py: ["8px", "8px"],
      minHeight: ["44px", "38px"],
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        bg: "white",
        borderColor: "orange",
        color: "darkOrange",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
        transform: "translateY(-1px)",
      },
      "&:active": {
        transform: "translateY(0) scale(0.98)",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      },
      "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "orange",
        outlineOffset: "2px",
      },
      "&:disabled": {
        opacity: 0.6,
        cursor: "not-allowed",
        backgroundColor: "lightgray",
        boxShadow: "none",
        transform: "none",
      },
    },
    toggle: {
      fontFamily: "body",
      fontWeight: "bold",
      fontSize: "0.875rem",
      cursor: "pointer",
      userSelect: "none",
      border: "2px solid",
      borderColor: "primary",
      borderRadius: "20px",
      px: "12px",
      py: "6px",
      minHeight: ["44px", "36px"],
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        opacity: 0.85,
        borderColor: "orange",
      },
      "&:active": {
        transform: "scale(0.97)",
      },
      "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "orange",
        outlineOffset: "2px",
      },
    },
    toggleActive: {
      fontFamily: "body",
      fontWeight: "bold",
      fontSize: "0.875rem",
      cursor: "pointer",
      userSelect: "none",
      borderRadius: "20px",
      px: "12px",
      py: "6px",
      minHeight: ["44px", "36px"],
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      bg: "primary",
      color: "white",
      border: "2px solid",
      borderColor: "primary",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.12)",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        borderColor: "orange",
      },
      "&:active": {
        transform: "scale(0.97)",
      },
      "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "orange",
        outlineOffset: "2px",
      },
    },
    toggleInactive: {
      fontFamily: "body",
      fontWeight: "bold",
      fontSize: "0.875rem",
      cursor: "pointer",
      userSelect: "none",
      borderRadius: "20px",
      px: "12px",
      py: "6px",
      minHeight: ["44px", "36px"],
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      bg: "transparent",
      color: "primary",
      border: "2px solid",
      borderColor: "rgba(41, 46, 41, 0.25)",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        borderColor: "orange",
        color: "darkOrange",
        bg: "lightOrange",
      },
      "&:active": {
        transform: "scale(0.97)",
      },
      "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "orange",
        outlineOffset: "2px",
      },
    },
    disabled: {},
    ghost: {
      fontFamily: "body",
      cursor: "pointer",
      userSelect: "none",
      bg: "transparent",
      color: "inherit",
      border: "none",
      boxShadow: "none",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        bg: "transparent",
        boxShadow: "none",
      },
      "&:active": {
        transform: "scale(0.98)",
      },
      "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "orange",
        outlineOffset: "2px",
      },
    },
  },
  inputs: {
    primary: {
      "&:focus": {
        border: "1px solid orange",
      },
    },
  },
};

export default theme;
