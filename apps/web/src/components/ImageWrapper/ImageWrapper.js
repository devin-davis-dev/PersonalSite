import { Box } from "theme-ui";

function ImageWrapper({ children }) {
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
