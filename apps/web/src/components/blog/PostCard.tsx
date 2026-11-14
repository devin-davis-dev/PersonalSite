import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import type React from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  Heading,
  Text,
  type ThemeUIStyleObject,
} from "theme-ui";
import { colors } from "../../theme/theme";
import type { BlogPost } from "../../types";

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

const cardStyle: ThemeUIStyleObject = {
  color: "white",
  height: "max-content",
  borderRadius: "10px",
  overflow: "hidden",
  backgroundColor: "primary",
};

const imageContainerStyle: ThemeUIStyleObject = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "100%",
  minHeight: ["200px", "200px", "200px", "100%"],
  backgroundColor: "primary",
};

const imageFadeOverlayStyle: ThemeUIStyleObject = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: "none",
  background: [
    `linear-gradient(to bottom, rgba(41, 46, 41, 0) 70%, ${colors.primary} 100%)`,
    `linear-gradient(to bottom, rgba(41, 46, 41, 0) 70%, ${colors.primary} 100%)`,
    `linear-gradient(to bottom, rgba(41, 46, 41, 0) 70%, ${colors.primary} 100%)`,
    `linear-gradient(to right, rgba(41, 46, 41, 0) 70%, ${colors.primary} 100%)`,
    `linear-gradient(to right, rgba(41, 46, 41, 0) 70%, ${colors.primary} 100%)`,
  ],
};

const cardBodyStyle: ThemeUIStyleObject = {
  bg: "primary",
  width: "100%",
  p: 3,
};

const headingStyle: ThemeUIStyleObject = {
  whiteSpace: "nowrap",
  maxWidth: "100%",
  textOverflow: "ellipsis",
  overflow: "hidden",
  height: "38px",
  color: "white",
  mb: 0,
};

const dateStyle: ThemeUIStyleObject = {
  color: "white",
  mb: 2,
  display: "block",
  fontWeight: "bold",
};

const contentStyle: ThemeUIStyleObject = {
  a: { color: "orange" },
  color: "white",
};

const readButtonStyle: ThemeUIStyleObject = {
  mt: 3,
};

const gridColumnsWithImage = [1, 1, 1, "1fr 3fr", "1fr 5fr"];

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const imageImgStyle: React.CSSProperties = {
  objectFit: "cover",
};

export interface PostCardProps {
  post: BlogPost;
  postContent?: string;
  className?: string;
  id?: string;
}

export const PostCard = ({
  post,
  postContent,
  className,
  id,
}: PostCardProps) => {
  const { t } = useTranslation("common");
  const cardImage = getImage(post.thumbnail as any);
  const hasImage = Boolean(post.thumbnail && cardImage);

  return (
    <Card
      as="article"
      id={id}
      className={className}
      variant="primary"
      sx={cardStyle}
    >
      <Grid gap={0} columns={hasImage ? gridColumnsWithImage : 1}>
        {hasImage && cardImage && (
          <Box sx={imageContainerStyle}>
            <GatsbyImage
              style={imageStyle}
              imgStyle={imageImgStyle}
              crossOrigin="anonymous"
              image={cardImage}
              alt={post.title}
            />
            <Box
              sx={imageFadeOverlayStyle}
              aria-hidden="true"
              data-testid="post-card-fade-overlay"
            />
          </Box>
        )}
        <Box sx={cardBodyStyle}>
          <Heading as="h2" variant="subheading1" sx={headingStyle}>
            {post.title}
          </Heading>
          <Text variant="regular" sx={dateStyle}>
            {post.date}
          </Text>
          {postContent && (
            <Text sx={contentStyle} variant="small">
              {postContent}
            </Text>
          )}
          <Box>
            <Link
              to={`${post.slug}`}
              aria-label={`${t("read_post", { title: post.title })}`}
            >
              <Button
                variant="secondary"
                sx={readButtonStyle}
                className="secondary-btn"
              >
                {t("read")}
                <Box as="span" sx={visuallyHiddenStyle}>
                  : {post.title}
                </Box>
              </Button>
            </Link>
          </Box>
        </Box>
      </Grid>
    </Card>
  );
};
