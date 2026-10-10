import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  Link as ThemeLink,
} from "theme-ui";

const Footer = () => {
  const { t } = useTranslation("common");
  return (
    <footer>
      <Grid sx={{ bg: "primary", py: 4 }} columns={[1, null, 3]}>
        <Box sx={{ textAlign: "center" }}>
          <Heading
            as="h4"
            sx={{ mb: 3, color: "white", fontFamily: "heading" }}
          >
            {t("footer_contact_title")}
          </Heading>
          <Text variant="small" sx={{ color: "white" }}>
            {t("footer_contact_text")}
          </Text>
          <Link to="/contact" sx={{ display: "block", mt: 3 }}>
            <Button variant="secondary">{t("footer_contact_button")}</Button>
          </Link>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Heading
            as="h4"
            sx={{ mb: 3, color: "white", fontFamily: "heading" }}
          >
            {t("footer_media_title")}
          </Heading>
          <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
            <ThemeLink
              target="_blank"
              href="https://www.linkedin.com/in/devin-dev-d-63008412b"
              sx={{ mb: 2, width: "max-content", svg: { fontSize: "1.2em" } }}
              variant="footer"
            >
              <Icon icon={faLinkedin} />
              <Text sx={{ color: "white", ml: 1 }} variant="small">
                {" "}
                LinkedIn
              </Text>
            </ThemeLink>
            <ThemeLink
              target="_blank"
              href="https://www.instagram.com/devindavis732/"
              sx={{ mb: 2, width: "max-content", svg: { fontSize: "1.2em" } }}
              variant="footer"
            >
              <Icon icon={faInstagram} />
              <Text sx={{ color: "white", ml: 1 }} variant="small">
                {" "}
                Instagram
              </Text>
            </ThemeLink>
          </Flex>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Heading
            as="h4"
            sx={{ mb: 3, color: "white", fontFamily: "heading" }}
          >
            {t("footer_nav_title")}
          </Heading>
          <Flex as="nav" sx={{ flexDirection: "column", alignItems: "center" }}>
            <Link
              to="/"
              sx={{
                mb: 2,
                width: "max-content",
                color: "white",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("nav_home")}
            </Link>
            <Link
              to="/contact"
              sx={{
                mb: 2,
                width: "max-content",
                color: "white",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("nav_contact")}
            </Link>
            <Link
              to="/projects"
              sx={{
                mb: 2,
                width: "max-content",
                color: "white",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("nav_projects")}
            </Link>
            <Link
              to="/about"
              sx={{
                mb: 2,
                width: "max-content",
                color: "white",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("nav_about")}
            </Link>
            <Link
              to="/climbing"
              sx={{
                mb: 2,
                width: "max-content",
                color: "white",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("nav_climbing")}
            </Link>
          </Flex>
        </Box>
      </Grid>
    </footer>
  );
};

export default Footer;
