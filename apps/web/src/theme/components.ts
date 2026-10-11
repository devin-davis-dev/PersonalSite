import Prism from "@theme-ui/prism";
import type React from "react";

const components = {
  pre: (props: { children: React.ReactNode }) => props.children,
  code: Prism,
};

export default components;
