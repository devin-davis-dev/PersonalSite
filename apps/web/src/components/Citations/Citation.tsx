import type React from "react";
import { Link as ThemeLink, type ThemeUIStyleObject } from "theme-ui";
import { useCitation } from "./CitationContext";

const citationLinkStyle: ThemeUIStyleObject = {
  color: "blue",
  fontWeight: "600",
  textDecoration: "underline",
  textDecorationStyle: "dotted",
  textUnderlineOffset: "3px",
  cursor: "pointer",
  borderRadius: "4px",
  px: "3px",
  py: "1px",
  transition: "color 0.2s ease, background-color 0.2s ease",
  "&:hover": {
    color: "darkOrange",
    bg: "lightOrange",
    textDecorationStyle: "solid",
  },
  "&:focus-visible": {
    outline: "2px solid",
    outlineColor: "orange",
    outlineOffset: "2px",
  },
};

export interface CitationProps {
  to?: string;
  id?: string;
  refId?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Citation({
  to,
  id,
  refId,
  href,
  children,
  className,
}: CitationProps) {
  const { highlightReference } = useCitation();
  const rawTarget = to || id || refId || href || "";
  const targetId = rawTarget.replace(/^#/, "").replace(/^ref-/, "");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (targetId) {
      highlightReference(targetId);
    }
  };

  return (
    <ThemeLink
      href={`#ref-${targetId}`}
      onClick={handleClick}
      className={className}
      aria-label={`Jump to reference: ${targetId}`}
      sx={citationLinkStyle}
    >
      {children}
    </ThemeLink>
  );
}

export default Citation;
