import { graphql } from "gatsby";
import { Box, Grid, Heading, Text } from "theme-ui";

import PostCard from "../components/PostCard/PostCard";
import Seo from "../components/Seo/Seo";
import Layout from "../components/app/Layout";

const AllPostsPage = ({ data }) => {
  const pageData = data.allMdx.edges;

  return (
    <Layout>
      <Seo title="Blog" />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          my: 6,
        }}
      >
        <Box sx={{ mt: 6, mb: 5 }}>
          <Heading as="h1" variant="hero">
            Blog Posts
          </Heading>
          <Text variant="large">
            Looking to learn more about web development? Here I post content
            about various web related topics.
          </Text>
        </Box>
        <Grid
          sx={{
            mb: 6,
          }}
          gap={3}
          columns={[1]}
        >
          {pageData.map(({ node }) => {
            const post = node.frontmatter;
            const excerpt = node.excerpt;
            post.slug = node.fields.slug;
            return (
              <PostCard
                key={node.fields.slug}
                post={post}
                postContent={excerpt}
              />
            );
          })}
        </Grid>
      </Box>
    </Layout>
  );
};

export default AllPostsPage;

export const programmingPostsPageQuery = graphql`
  query ProgrammingPostsPageQuery($language: String!) {
    allMdx(
      filter: {
        frontmatter: { draft: { eq: false } }
        internal: { contentFilePath: { regex: "/content/blog/" } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM, YYYY")
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
          excerpt(pruneLength: 100)
        }
      }
    }

    locales: allLocale(
      filter: { ns: { in: ["common"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
