import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import type React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  type ThemeUIStyleObject,
} from "theme-ui";

const visuallyHiddenStyle: ThemeUIStyleObject = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: "1px",
  whiteSpace: "nowrap",
  wordWrap: "normal",
};

export interface PostCategoryCardProps {
  title: React.ReactNode;
  content?: React.ReactNode;
  link: string;
}

export function PostCategoryCard({
  title,
  content,
  link,
}: PostCategoryCardProps) {
  const { t } = useTranslation("common");
  const categoryTitle = typeof title === "string" ? title : link;

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
      <Link
        to={link}
        aria-label={`${t("read_category", { category: categoryTitle })}`}
        sx={{ textDecoration: "none", color: "white" }}
      >
        <Button sx={{ display: "block" }}>
          {t("read")}
          <Box as="span" sx={visuallyHiddenStyle}>
            : {title}
          </Box>
        </Button>
      </Link>
    </Flex>
  );
}
