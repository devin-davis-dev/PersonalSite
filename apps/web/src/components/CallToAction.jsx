import { Link } from "gatsby-plugin-react-i18next";

// Components
import { Box, Button, Flex, Heading, Text } from "theme-ui";

const CallToAction = ({ title, content, buttonText, pageLink }) => {
  return (
    <Flex
      sx={{
        textAlign: "center",
        flexDirection: "column",
        justifyContent: "center",
        px: [0, 3],
        bg: "primary",
        color: "white",
        p: 4,
        borderRadius: "10px",
      }}
    >
      <Heading as="h2" variant="subheading1" color="white">
        {title}
      </Heading>
      <Text variant="regular" sx={{ color: "white" }}>
        {content}
      </Text>
      <Box sx={{ mt: 4 }}>
        <Link to={pageLink}>
          <Button variant="primary">{buttonText}</Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default CallToAction;
