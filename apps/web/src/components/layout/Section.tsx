import type React from "react";
import { Box } from "theme-ui";

interface SectionProps {
  children: React.ReactNode;
}

export const Section = ({ children }: SectionProps) => {
  return (
    <Box
      p={4}
      mt={4}
      sx={{
        backgroundColor: "primary",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};
