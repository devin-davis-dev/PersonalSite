import { type PageProps, graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { Box, Flex, Grid, Heading, Text } from "theme-ui";

import PostCategoryCard from "../components/PostCategoryCard/PostCategoryCard";
import Seo from "../components/Seo/Seo";
import Layout from "../components/app/Layout";
import PageContentWrapper from "../layouts/PageWrapper";

interface BlogPageData {
  allMdx: {
    distinct: string[];
  };
}

const BlogPage = ({ data }: PageProps<BlogPageData>) => {
  const categories = data.allMdx.distinct;
  const { t } = useTranslation("blog");

  return (
    <Layout>
      <Seo title={t("page_title")} />
      <PageContentWrapper>
        <Flex sx={{ mb: 5 }}>
          <Box>
            <Heading as="h1" variant="hero">
              {t("page_title")}
            </Heading>
            <Text variant="large">{t("page_description")}</Text>
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
                return `${w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()} `;
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

export default BlogPage;
