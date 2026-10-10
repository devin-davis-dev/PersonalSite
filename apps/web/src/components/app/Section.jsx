import PropTypes from "prop-types";
import { Box } from "theme-ui";

export const Section = ({ children }) => {
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

Section.propTypes = {
  children: PropTypes.node.isRequired,
};
