import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { useThemedStylesWithMdx } from "@theme-ui/mdx";
import Prism from "@theme-ui/prism";
import type React from "react";
import { ThemeUIProvider } from "theme-ui";

import theme from "../../theme/theme";
import Footer from "./Footer";
import Navbar from "./Navbar";

import "../../css/reset.css";

const components: Record<string, any> = {
  pre: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  code: Prism,
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
      <MDXProvider components={componentsWithStyles as any}>
        <Navbar />
        <main sx={{ paddingTop: "60px" }}>{children}</main>
        <Footer />
      </MDXProvider>
    </ThemeUIProvider>
  );
};

export default Layout;
