import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { useThemedStylesWithMdx } from "@theme-ui/mdx";
import Prism from "@theme-ui/prism";
import type React from "react";
import { ThemeUIProvider } from "theme-ui";

import theme from "../../theme/theme";
import Web3Provider from "../Web3Provider";
import Footer from "./Footer";
import Navbar from "./Navbar";

import "../../css/reset.css";
import "@rainbow-me/rainbowkit/styles.css";

const components: Record<string, any> = {
  pre: (props: any) => {
    if (
      props.children &&
      typeof props.children === "object" &&
      "props" in props.children
    ) {
      return <Prism {...props.children.props} />;
    }
    return <Prism {...props} />;
  },
  code: (props: any) => {
    if (props.className && /language-/.test(props.className)) {
      return <Prism {...props} />;
    }
    return (
      <code
        sx={{
          fontFamily: "monospace",
          fontSize: "0.875em",
          color: "primary",
          bg: "secondary",
          px: "0.35em",
          py: "0.15em",
          borderRadius: "4px",
        }}
        {...props}
      />
    );
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const componentsWithStyles = useThemedStylesWithMdx(
    useMDXComponents(components),
  );
  return (
    <ThemeUIProvider theme={theme}>
      <Web3Provider>
        <MDXProvider components={componentsWithStyles as any}>
          <Navbar />
          <main sx={{ paddingTop: "60px" }}>{children}</main>
          <Footer />
        </MDXProvider>
      </Web3Provider>
    </ThemeUIProvider>
  );
};

export default Layout;
