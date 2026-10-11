import type React from "react";
import { Box } from "theme-ui";

interface PageContentWrapperProps {
  children: React.ReactNode;
}

const PageContentWrapper = ({ children }: PageContentWrapperProps) => {
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

export default PageContentWrapper;
