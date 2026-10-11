import { Link } from "gatsby-plugin-react-i18next";
import { Box, Button, Flex, Heading, Text } from "theme-ui";

interface CallToActionProps {
  title: string;
  content: string;
  buttonText: string;
  pageLink: string;
  sx?: any;
}

const CallToAction = ({
  title,
  content,
  buttonText,
  pageLink,
  sx,
}: CallToActionProps) => {
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
        ...sx,
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
