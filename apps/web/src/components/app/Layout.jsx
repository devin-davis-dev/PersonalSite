import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { useThemedStylesWithMdx } from "@theme-ui/mdx";
import Prism from "@theme-ui/prism";
import { ThemeUIProvider } from "theme-ui";

import theme from "../../theme/theme";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

import "../../css/reset.css";

const components = {
  pre: ({ children }) => <>{children}</>,
  code: Prism,
};

const Layout = ({ children }) => {
  const componentsWithStyles = useThemedStylesWithMdx(
    useMDXComponents(components),
  );
  return (
    <ThemeUIProvider theme={theme}>
      <MDXProvider components={componentsWithStyles}>
        <Navbar />
        <main sx={{ paddingTop: "60px" }}>{children}</main>
        <Footer />
      </MDXProvider>
    </ThemeUIProvider>
  );
};

export default Layout;
