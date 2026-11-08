import React from "react";
import { Citation, Reference, ReferenceList } from "./components/Citations";
import Collapsible from "./components/Collapsible/Collapsible";
import ImageWrapper from "./components/ImageWrapper/ImageWrapper";

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
