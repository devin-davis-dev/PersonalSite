import type React from "react";
import { Box } from "theme-ui";

interface ImageWrapperProps {
  children: React.ReactNode;
}

function ImageWrapper({ children }: ImageWrapperProps) {
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

export default ImageWrapper;
