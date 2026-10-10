import { GatsbyImage } from "gatsby-plugin-image";
import { getImage } from "gatsby-plugin-image";
import { Link } from "gatsby-plugin-react-i18next";

import { Box, Button, Card, Grid, Heading, Text } from "theme-ui";

const PostCard = ({ post, postContent }) => {
  const cardImage = getImage(post.thumbnail);

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
        {post.thumbnail && (
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
          <Text
            sx={{
              a: { color: "orange" },
              color: "white",
            }}
            variant="small"
          >
            {postContent}
          </Text>
          <Box>
            <Link to={`${post.slug}`}>
              <Button
                variant="secondary"
                sx={{ mt: 3 }}
                className="secondary-btn"
              >
                Read
              </Button>
            </Link>
          </Box>
        </Box>
      </Grid>
    </Card>
  );
};

export default PostCard;
