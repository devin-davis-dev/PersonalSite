import type React from "react";
import { Box } from "theme-ui";

export interface PageContentWrapperProps {
  children: React.ReactNode;
}

export const PageContentWrapper = ({ children }: PageContentWrapperProps) => {
  return (
    <Box
      sx={{
        margin: "0 auto",
        width: ["90%", "80%", "70%"],
        my: 5,
      }}
    >
      {children}
    </Box>
  );
};
