import { type PageProps, graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { Box, Grid, Heading, Text } from "theme-ui";

import PostCard from "../components/PostCard/PostCard";
import Seo from "../components/Seo/Seo";
import Layout from "../components/app/Layout";
import type { BlogPost } from "../types";

interface AllPostsPageData {
  allMdx: {
    edges: Array<{
      node: {
        fields: {
          slug: string;
        };
        frontmatter: {
          title: string;
          date: string;
          thumbnail?: any;
        };
        excerpt: string;
      };
    }>;
  };
}

const AllPostsPage = ({ data }: PageProps<AllPostsPageData>) => {
  const { t } = useTranslation("posts");
  const pageData = data.allMdx.edges;

  return (
    <Layout>
      <Seo title={t("seo_title")} />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          my: 6,
        }}
      >
        <Box sx={{ mt: 6, mb: 5 }}>
          <Heading as="h1" variant="hero">
            {t("page_title")}
          </Heading>
          <Text variant="large">{t("page_description")}</Text>
        </Box>
        <Grid
          sx={{
            mb: 6,
          }}
          gap={3}
          columns={[1]}
        >
          {pageData.map(({ node }) => {
            const post: BlogPost = {
              ...node.frontmatter,
              slug: node.fields.slug,
            };
            const excerpt = node.excerpt;
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
      filter: { ns: { in: ["common", "posts"] }, language: { eq: $language } }
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
