import { type PageProps, graphql } from "gatsby";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import { Box, Button, Grid, Heading, Text } from "theme-ui";

import PostCard from "../components/PostCard/PostCard";
import Seo from "../components/Seo/Seo";
import Layout from "../components/app/Layout";
import PageContentWrapper from "../layouts/PageWrapper";
import type { BlogPost } from "../types";

interface CategoryPageData {
  allMdx: {
    edges: Array<{
      node: {
        fields: {
          slug: string;
        };
        frontmatter: {
          title: string;
          date: string;
          category: string;
          thumbnail?: any;
        };
        excerpt?: string;
      };
    }>;
  };
}

interface CategoryPageContext {
  category: string;
}

const CategoryPage = ({
  data,
  pageContext,
}: PageProps<CategoryPageData, CategoryPageContext>) => {
  const pageData = data.allMdx.edges;
  const postCategory =
    pageContext?.category || pageData[0]?.node.frontmatter.category || "";
  const { t } = useTranslation("blog");

  const formattedCategory = postCategory
    ? postCategory
        .split("-")
        .map(
          (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
        )
        .join(" ")
    : "";

  return (
    <Layout>
      <Seo
        title={t("category_title", { category: formattedCategory })}
        description={t("category_description", { category: formattedCategory })}
        keywords={[
          "Devin Davis",
          "Category Posts",
          "Web Development Blog",
          `${formattedCategory} Tutorials`,
          `${formattedCategory} Insights`,
          `${formattedCategory} Articles`,
          `Latest ${formattedCategory} Updates`,
          "Web Developer Blog",
          "Tech Tutorials",
          "Coding Insights",
          "Programming Blog",
          "Web Development News",
          "Innovative Web Solutions",
          "Web Development Tips",
          "Developer Resources",
        ]}
      />
      <PageContentWrapper>
        <Heading as="h1" variant="hero">
          {t("category_title", { category: formattedCategory })}
        </Heading>
        <Text variant="large" sx={{ my: 3, display: "block" }}>
          {t("category_description", { category: formattedCategory })}
        </Text>
        <Grid
          sx={{
            mb: 6,
          }}
          gap={3}
          columns={[1]}
        >
          {pageData.length > 0 ? (
            pageData.map(({ node }) => {
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
            })
          ) : (
            <Box sx={{ height: "80vh" }}>
              <Heading as="h2" sx={{ mb: 3 }}>
                {t("no_posts")}
              </Heading>
              <Link to="/blog">
                <Button>{t("back_to_blog")}</Button>
              </Link>
            </Box>
          )}
        </Grid>
      </PageContentWrapper>
    </Layout>
  );
};

export default CategoryPage;

export const pageQuery = graphql`
  query PostsByCategoryQuery($category: String!, $language: String!) {
    allMdx(
      filter: {
        frontmatter: { draft: { eq: false }, category: { eq: $category } }
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
            date(formatString: "MMMM do, YYYY")
            category
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
    }

    locales: allLocale(
      filter: { ns: { in: ["common", "blog"] }, language: { eq: $language } }
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
