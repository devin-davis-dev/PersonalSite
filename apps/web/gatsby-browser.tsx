import "./src/css/prismjs.css";
import "./src/css/fonts.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { GatsbyBrowser } from "gatsby";

// Scroll to top on every route change
export const shouldUpdateScroll: GatsbyBrowser["shouldUpdateScroll"] = () => {
  window.scrollTo(0, 0);
  return false;
};
