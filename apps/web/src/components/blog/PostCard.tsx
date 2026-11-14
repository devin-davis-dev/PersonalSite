import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import {
  Box,
  Button,
  Card,
  Grid,
  Heading,
  Text,
  type ThemeUIStyleObject,
} from "theme-ui";
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

export interface PostCardProps {
  post: BlogPost;
  postContent?: string;
}

export const PostCard = ({ post, postContent }: PostCardProps) => {
  const { t } = useTranslation("common");
  const cardImage = getImage(post.thumbnail as any);

  return (
    <Card
      variant="primary"
      sx={{
        color: "white",
        height: "max-content",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Grid
        gap={0}
        columns={post.thumbnail ? [1, 1, 1, "1fr 3fr", "1fr 5fr"] : 1}
      >
        {post.thumbnail && cardImage && (
          <GatsbyImage
            imgStyle={{ objectFit: "cover" }}
            crossOrigin="anonymous"
            image={cardImage}
            alt={post.title}
          />
        )}
        <Box
          sx={{
            bg: "primary",
            width: "100%",
            p: 3,
          }}
        >
          <Heading
            as="h2"
            variant="subheading1"
            sx={{
              whiteSpace: "nowrap",
              maxWidth: "100%",
              textOverflow: "ellipsis",
              overflow: "hidden",
              height: "38px",
              color: "white",
              mb: 0,
            }}
          >
            {post.title}
          </Heading>
          <Text
            variant="regular"
            sx={{ color: "white", mb: 2, display: "block", fontWeight: "bold" }}
          >
            {post.date}
          </Text>
          {postContent && (
            <Text
              sx={{
                a: { color: "orange" },
                color: "white",
              }}
              variant="small"
            >
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
                sx={{ mt: 3 }}
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
