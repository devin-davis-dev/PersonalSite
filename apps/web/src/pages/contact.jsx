import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { graphql } from "gatsby";
import { Link as I18nLink, useTranslation } from "gatsby-plugin-react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Link,
  Paragraph,
  Text,
  Textarea,
} from "theme-ui";
import * as yup from "yup";

import Seo from "../components/Seo/Seo";
import Layout from "../components/app/Layout";
import useToast from "../hooks/use-toast";

const SubmitSuccess = ({ showToast, t }) => {
  const copyPGP = useCallback(async () => {
    try {
      const response = await fetch("/pgp-key.asc");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      showToast(t("pgp_copy_success"), "success");
    } catch {
      showToast(t("pgp_copy_error"));
    }
  }, [showToast, t]);

  return (
    <Flex
      sx={{
        minHeight: "calc(100vh - 160px)",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box textAlign="center">
        <Heading variant="large" sx={{ mb: 3 }}>
          {t("success_title")}
        </Heading>
        <Text variant="regular" sx={{ my: 3, display: "block" }}>
          {t("success_subtitle")}
        </Text>
        <Flex sx={{ gap: 3, alignItems: "center", mb: 3 }}>
          <Box>
            {t("success_pgp_text")}{" "}
            <Link
              variant="text"
              href="https://www.fortinet.com/resources/cyberglossary/pgp-encryption"
            >
              {t("success_pgp_learn")}
            </Link>{" "}
          </Box>
        </Flex>
        <Button variant="secondary" sx={{ mr: 2 }} onClick={copyPGP}>
          <Text>{t("success_pgp_button")}</Text>
          <Icon
            sx={{
              ml: 2,
            }}
            icon={faCopy}
          />
        </Button>
        <I18nLink to="/">
          <Button variant="primary">{t("success_back_home")}</Button>
        </I18nLink>
      </Box>
    </Flex>
  );
};

const ContactPage = () => {
  const { t } = useTranslation("contact");
  const [isPostSuccessful, setIsPostSuccessful] = useState(false);
  const [isFormHighlighted, setIsFormHighlighted] = useState(false);
  const { showToast, Toast } = useToast();
  const schema = useMemo(
    () =>
      yup
        .object({
          email: yup.string().email().required(),
          subject: yup.string().min(1).max(40).required(),
          message: yup.string().min(1).max(5000).required(),
        })
        .required(),
    [],
  );

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const highlightContactForm = useCallback(() => {
    setFocus("email");
    setIsFormHighlighted(true);
    window.scrollTo(0, 200);
  }, [setFocus]);

  const onSubmit = useCallback(
    async (data) => {
      const encode = (formData) => {
        return Object.keys(formData)
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`,
          )
          .join("&");
      };

      try {
        const response = await fetch("/contact", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode({
            "form-name": "Contact Form",
            ...data,
          }),
        });

        if (response.ok) {
          setIsPostSuccessful(true);
          showToast(t("email_sent_success"), "success");
        } else {
          showToast(t("email_sent_error"));
        }
      } catch {
        showToast(t("email_sent_error"));
      }
    },
    [showToast, t],
  );

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

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
      {Toast}
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
        {!isPostSuccessful && (
          <Grid gap={3} columns={["1fr", "1fr 1fr", "1.5fr 2fr"]}>
            <Box
              sx={{
                border: isFormHighlighted ? "3px solid orange" : "none",
                borderRadius: 5,
                p: isFormHighlighted ? 3 : 0,
              }}
            >
              <Box
                as="form"
                action="/contact"
                name="Contact Form"
                method="POST"
                data-netlify="true"
                id="contact-form"
              >
                <Input
                  variant="primary"
                  sx={{ mb: 3, bg: "secondary" }}
                  type="hidden"
                  name="form-name"
                  value="Contact Form"
                />
                <Box>
                  <Input
                    sx={{
                      mb: 3,
                      bg: "primary",
                      color: "secondary",
                      border: "none",
                      p: 3,
                    }}
                    name="email"
                    {...register("email")}
                    type="text"
                    placeholder={t("placeholder_email")}
                  />
                  {errors.email && (
                    <Text sx={{ color: "red", mb: 3, display: "block" }}>
                      {errors.email.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Input
                    sx={{
                      mb: 3,
                      bg: "primary",
                      color: "secondary",
                      border: "none",
                      p: 3,
                    }}
                    name="subject"
                    {...register("subject")}
                    type="text"
                    placeholder={t("placeholder_subject")}
                  />
                  {errors.subject && (
                    <Text sx={{ color: "red", mb: 3, display: "block" }}>
                      {errors.subject.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Textarea
                    sx={{
                      mb: 3,
                      bg: "primary",
                      color: "secondary",
                      border: "none",
                      p: 3,
                      fontFamily: "roboto",
                      minHeight: "300px",
                      resize: "vertical",
                    }}
                    name="message"
                    {...register("message")}
                    type="text"
                    placeholder={t("placeholder_message")}
                  />
                  {errors.message && (
                    <Text sx={{ color: "red", mb: 3, display: "block" }}>
                      {errors.message.message}
                    </Text>
                  )}
                </Box>
                <Button
                  sx={{ flexShrink: 0 }}
                  variant="primary"
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("button_sending") : t("button_send")}
                </Button>
              </Box>
            </Box>
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
          </Grid>
        )}
        {isPostSuccessful && <SubmitSuccess showToast={showToast} t={t} />}
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
