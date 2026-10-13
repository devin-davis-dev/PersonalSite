import { graphql } from "gatsby";
import { Link as I18nLink, useTranslation } from "gatsby-plugin-react-i18next";
import { useCallback, useRef, useState } from "react";
import { Box, Grid, Heading, Link, Paragraph } from "theme-ui";

import ContactForm, {
  type ContactFormHandle,
} from "../components/ContactForm/ContactForm";
import Seo from "../components/Seo/Seo";
import Layout from "../components/app/Layout";

const ContactPage = () => {
  const { t } = useTranslation("contact");
  const [isPostSuccessful, setIsPostSuccessful] = useState(false);
  const [isFormHighlighted, setIsFormHighlighted] = useState(false);
  const contactFormRef = useRef<ContactFormHandle>(null);

  const highlightContactForm = useCallback(() => {
    setIsFormHighlighted(true);
    contactFormRef.current?.focus();
    window.scrollTo(0, 200);
  }, []);

  return (
    <Layout>
      <Seo
        title="Contact"
        description="Contact Devin Davis, a Full Stack Web Developer. Discuss your project or collaborate today. Open to freelance and full-time roles!"
        keywords={[
          "Full Stack Web Developer",
          "Devin S. Davis",
          "Contact Devin S. Davis",
          "Freelance Developer",
          "Contractor",
          "Full-Time Developer Opportunities",
          "Web Development Services",
          "Innovative Web Technologies",
          "Collaborate on Projects",
          "Hire a Web Developer",
          "Technical Solutions Expert",
          "Custom Web Solutions",
          "Web Developer Portfolio",
        ]}
      />
      <Box
        sx={{
          width: ["90%", "80%", "70%"],
          mx: "auto",
          my: 5,
        }}
      >
        {!isPostSuccessful && (
          <Box
            sx={{
              margin: "0 auto",
              mb: 4,
            }}
          >
            <Heading as="h1" variant="hero">
              {t("page_title")}
            </Heading>
            <Paragraph sx={{ my: 3, display: "block" }} variant="large">
              {t("page_subtitle")}
            </Paragraph>
          </Box>
        )}
        <Grid
          gap={3}
          columns={isPostSuccessful ? ["1fr"] : ["1fr", "1fr 1fr", "1.5fr 2fr"]}
        >
          <ContactForm
            ref={contactFormRef}
            isHighlighted={isFormHighlighted}
            onSuccess={() => setIsPostSuccessful(true)}
          />
          {!isPostSuccessful && (
            <Box sx={{ mb: 3 }}>
              <Paragraph>
                {t("sidebar_text_1")}
                <I18nLink
                  to="/about"
                  sx={{
                    color: "blue",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#E07A5F",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {t("sidebar_link_text")}
                </I18nLink>
                {t("sidebar_text_2")}
                <Link
                  variant="text"
                  target="_blank"
                  href="https://www.linkedin.com/in/devin-dev-d-63008412b"
                >
                  LinkedIn
                </Link>
                {t("sidebar_text_3")}
                <Link
                  sx={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={highlightContactForm}
                >
                  {t("sidebar_contact_form")}
                </Link>
                {t("sidebar_text_4")}
              </Paragraph>
              <Heading variant="subheading2" sx={{ mt: 3 }}>
                {t("availability_title")}
              </Heading>
              <Paragraph>{t("availability_text")}</Paragraph>
              <Heading variant="subheading2" sx={{ mt: 3 }}>
                {t("check_out_work_title")}
              </Heading>
              <Paragraph>
                {t("check_out_work_text")}
                <I18nLink
                  to="/projects"
                  sx={{
                    color: "blue",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#E07A5F",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {t("view_portfolio")}
                </I18nLink>
                {t("check_out_work_suffix")}
              </Paragraph>
            </Box>
          )}
        </Grid>
      </Box>
    </Layout>
  );
};

export const contactPageQuery = graphql`
  query ContactPageQuery($language: String!) {
    locales: allLocale(
      filter: { ns: { in: ["common", "contact"] }, language: { eq: $language } }
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

export default ContactPage;
