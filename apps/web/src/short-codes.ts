import React from "react";
import { Citation } from "./components/blog/Citation";
import { Collapsible } from "./components/blog/Collapsible";
import { ImageWrapper } from "./components/blog/ImageWrapper";
import { Reference } from "./components/blog/Reference";
import { ReferenceList } from "./components/blog/ReferenceList";

const ExternalLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isExternal =
    props.href?.startsWith("http://") || props.href?.startsWith("https://");
  if (isExternal) {
    return React.createElement("a", {
      ...props,
      target: "_blank",
      rel: "noopener noreferrer",
    });
  }
  return React.createElement("a", props);
};

const globalCodes: Record<string, React.ComponentType<any>> = {
  a: ExternalLink,
  ImageWrapper,
  Collapsible,
  Accordion: Collapsible,
  Dropdown: Collapsible,
  Citation,
  Reference,
  ReferenceItem: Reference,
  ReferenceList,
};

export default globalCodes;
