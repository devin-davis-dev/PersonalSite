import { graphql } from "gatsby";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import { Box, Button, Flex, Heading, Text } from "theme-ui";

import Seo from "../components/Seo/Seo";
import Layout from "../components/app/Layout";

const NotFoundPage = () => {
  const { t } = useTranslation("404");

  return (
    <Layout>
      <Seo title="Page Not Found | Dev the Developer" />
      <Box
        sx={{
          bg: "primary",
          pt: 5,
          pb: 5,
          width: "100%",
        }}
      >
        <Flex
          sx={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: ["90%", "80%", "70%"],
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Text
            sx={{
              fontSize: ["6rem", "8rem", "10rem"],
              fontWeight: "bold",
              color: "orange",
              lineHeight: 1,
              mb: 3,
            }}
          >
            404
          </Text>
          <Heading as="h1" variant="hero" color="white" sx={{ mb: 0 }}>
            {t("page_title")}
          </Heading>
        </Flex>
      </Box>
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          pt: 4,
          textAlign: "center",
        }}
      >
        <Text variant="regular" sx={{ maxWidth: "500px", mx: "auto" }}>
          {t("description")}
        </Text>
        <Flex
          sx={{
            gap: 3,
            justifyContent: "center",
            flexWrap: "wrap",
            mb: 4,
            mt: 4,
          }}
        >
          <Link to="/">
            <Button variant="primary">{t("go_home")}</Button>
          </Link>
          <Link to="/blog">
            <Button variant="secondary">{t("read_blog")}</Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary">{t("contact_me")}</Button>
          </Link>
        </Flex>
      </Box>
    </Layout>
  );
};

export const notFoundPageQuery = graphql`
  query NotFoundPageQuery($language: String!) {
    locales: allLocale(
      filter: { ns: { in: ["common", "404"] }, language: { eq: $language } }
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

export default NotFoundPage;
