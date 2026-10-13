import Prism from "@theme-ui/prism";
import React from "react";

const components = {
  pre: (props: any) => {
    if (
      props.children &&
      typeof props.children === "object" &&
      "props" in props.children
    ) {
      return React.createElement(Prism, props.children.props);
    }
    return React.createElement(Prism, props);
  },
  code: (props: any) => {
    if (props.className && /language-/.test(props.className)) {
      return React.createElement(Prism, props);
    }
    return React.createElement(
      "code",
      {
        sx: {
          fontFamily: "monospace",
          fontSize: "0.875em",
          color: "primary",
          bg: "secondary",
          px: "0.35em",
          py: "0.15em",
          borderRadius: "4px",
        },
        ...props,
      },
      props.children,
    );
  },
};

export default components;
