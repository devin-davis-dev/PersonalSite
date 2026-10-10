import { Box } from "theme-ui";

const PageContentWrapper = ({ children }) => {
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
