import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { Box, Button, Heading, Paragraph, Link as ThemeLink } from "theme-ui";

import Seo from "../components/Seo/Seo";
import Layout from "../components/app/Layout";
import PageContentWrapper from "../layouts/PageWrapper";

const ENTE_ALBUM_URL =
  "https://embed.ente.io/?t=uAFNNGB7#8hcNmSB47YPpmYWgZRggLsxdqnGxnmAqu7BRQCrNYJwB";

const ClimbingPage = () => {
  const { t } = useTranslation("climbing");

  return (
    <Layout>
      <Seo title="Climbing" />
      <PageContentWrapper>
        <Heading as="h1" variant="hero">
          {t("page_title")}
        </Heading>
        <Paragraph variant="large" sx={{ mb: 4 }}>
          {t("page_description")}
        </Paragraph>
        <Box
          sx={{
            width: "100%",
            height: "80vh",
            borderRadius: "10px",
            overflow: "hidden",
            mb: 4,
          }}
        >
          <Box
            as="iframe"
            src={ENTE_ALBUM_URL}
            title={t("page_title")}
            loading="lazy"
            allowFullScreen
            sx={{
              display: "block",
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </Box>
        <ThemeLink
          href={ENTE_ALBUM_URL}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ display: "inline-block" }}
        >
          <Button variant="primary">{t("view_album")}</Button>
        </ThemeLink>
      </PageContentWrapper>
    </Layout>
  );
};

export const climbingPageQuery = graphql`
  query ClimbingPageQuery($language: String!) {
    locales: allLocale(
      filter: {
        ns: { in: ["common", "climbing"] }
        language: { eq: $language }
      }
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

export default ClimbingPage;
