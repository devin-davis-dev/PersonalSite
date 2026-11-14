import type React from "react";
import { Box, type ThemeUIStyleObject } from "theme-ui";

const referenceListStyle: ThemeUIStyleObject = {
  listStyle: "none",
  p: 0,
  m: 0,
  mb: 4,
};

export interface ReferenceListProps {
  children: React.ReactNode;
  className?: string;
}

export function ReferenceList({ children, className }: ReferenceListProps) {
  return (
    <Box as="ul" className={className} sx={referenceListStyle}>
      {children}
    </Box>
  );
}
