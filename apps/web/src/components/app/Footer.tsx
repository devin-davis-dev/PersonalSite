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
  type ThemeUIStyleObject,
} from "theme-ui";
import { useExternalNavLinks, useNavLinks } from "../../hooks/use-nav-links";

const footerLinkStyle: ThemeUIStyleObject = {
  mb: 2,
  width: "max-content",
  display: "inline-flex",
  alignItems: "center",
  fontSize: 1,
  lineHeight: "body",
  color: "white",
  textDecoration: "none",
  transition: "color 0.2s ease-in-out",
  "&:visited": {
    color: "white",
  },
  "&:hover": {
    color: "orange",
    textDecoration: "underline",
  },
  svg: {
    fontSize: "1.2em",
    mr: 1,
  },
};

const Footer = () => {
  const { t } = useTranslation("common");
  const navLinks = useNavLinks();
  const externalNavLinks = useExternalNavLinks();

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
            {externalNavLinks.map((link) => (
              <ThemeLink
                key={link.to}
                target="_blank"
                href={link.to}
                sx={footerLinkStyle}
              >
                {link.icon && <Icon icon={link.icon} aria-hidden={true} />}
                <span>{link.label}</span>
              </ThemeLink>
            ))}
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
            <Link to="/" sx={footerLinkStyle}>
              {t("nav_home")}
            </Link>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} sx={footerLinkStyle}>
                {link.label}
              </Link>
            ))}
          </Flex>
        </Box>
      </Grid>
    </footer>
  );
};

export default Footer;
