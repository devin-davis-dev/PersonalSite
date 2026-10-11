import { Link } from "gatsby-plugin-react-i18next";
import type React from "react";
import { Button, Flex, Heading, Text } from "theme-ui";

interface PostCategoryCardProps {
  title: React.ReactNode;
  content?: React.ReactNode;
  link: string;
}

function PostCategoryCard({ title, content, link }: PostCategoryCardProps) {
  return (
    <Flex
      sx={{
        bg: "primary",
        color: "white",
        p: 4,
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        borderRadius: "10px",
      }}
    >
      <Heading as="h2" variant="subheading1" color="white">
        {title}
      </Heading>
      {content && (
        <Text variant="regular" sx={{ color: "white", mb: 4 }}>
          {content}
        </Text>
      )}
      <Link to={link} sx={{ textDecoration: "none", color: "white" }}>
        <Button sx={{ display: "block" }}>Read</Button>
      </Link>
    </Flex>
  );
}

export default PostCategoryCard;
