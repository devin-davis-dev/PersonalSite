import type React from "react";
import { Box, type ThemeUIStyleObject } from "theme-ui";
import { useCitation } from "./CitationContext";

const referenceItemStyle = (isHighlighted: boolean): ThemeUIStyleObject => ({
  mb: 3,
  py: 2,
  px: 3,
  borderRadius: "8px",
  borderLeft: "4px solid",
  borderLeftColor: isHighlighted ? "orange" : "transparent",
  bg: isHighlighted ? "rgba(255, 166, 48, 0.2)" : "transparent",
  boxShadow: isHighlighted ? "0 0 14px rgba(255, 166, 48, 0.35)" : "none",
  transform: isHighlighted ? "translateX(4px)" : "none",
  transition:
    "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
  lineHeight: 1.6,
  "& a": {
    color: "orange",
    wordBreak: "break-all",
  },
});

export interface ReferenceProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function Reference({ id, children, className }: ReferenceProps) {
  const { activeRefId } = useCitation();
  const cleanId = id.replace(/^#/, "").replace(/^ref-/, "");
  const isHighlighted = activeRefId === cleanId;

  return (
    <Box
      as="li"
      id={`ref-${cleanId}`}
      data-highlighted={isHighlighted ? "true" : undefined}
      className={className}
      sx={referenceItemStyle(isHighlighted)}
    >
      {children}
    </Box>
  );
}

export default Reference;
