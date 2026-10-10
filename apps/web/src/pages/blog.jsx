import { graphql } from "gatsby";
import { Box, Flex, Grid, Heading, Text } from "theme-ui";

import PostCategoryCard from "../components/PostCategoryCard/PostCategoryCard";
import Seo from "../components/Seo/Seo";
import Layout from "../components/app/Layout";
import PageContentWrapper from "../layouts/PageWrapper";

const BlogPage = ({ data }) => {
  const categories = data.allMdx.distinct;

  return (
    <Layout>
      <Seo title="Blog" />
      <PageContentWrapper>
        <Flex sx={{ mb: 5 }}>
          <Box>
            <Heading as="h1" variant="hero">
              Blog
            </Heading>
            <Text variant="large">
              I'm on a lifelong journey of learning and I love to share what I
              learn with others. When I get the chance I like to write about
              what I'm learning. This is an archive of my blog posts. Feel free
              to take a gander!
            </Text>
          </Box>
        </Flex>
        <Grid
          sx={{
            mb: 3,
          }}
          gap={3}
          columns={[1, 2]}
        >
          {categories.map((category) => (
            <PostCategoryCard
              key={category}
              title={category.split("-").map((w) => {
                return `${w.charAt(0).toUpperCase() + w.slice(1)} `;
              })}
              link={category}
            />
          ))}
        </Grid>
      </PageContentWrapper>
    </Layout>
  );
};

export const pageQuery = graphql`
  query BlogPageQuery($language: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    allMdx(filter: { frontmatter: { draft: { eq: false } } }) {
      distinct(field: { frontmatter: { category: SELECT } })
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

export default BlogPage;
