import type React from "react";
import { Box } from "theme-ui";

export interface ImageWrapperProps {
  children: React.ReactNode;
}

export function ImageWrapper({ children }: ImageWrapperProps) {
  return (
    <Box
      sx={{
        mb: 3,
        borderRadius: 5,
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
}
