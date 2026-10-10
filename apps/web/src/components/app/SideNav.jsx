import { StaticImage } from "gatsby-plugin-image";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import { Box, Flex } from "theme-ui";
import BuildStatus from "../BuildStatus/BuildStatus";
import { CloseButton } from "./CloseButton";

const SideNav = ({ isOpen, setSideNavOpen, enableScrollFunc }) => {
  const { t } = useTranslation("common");
  const handleLinkClick = () => {
    setSideNavOpen(false);
    enableScrollFunc();
  };

  return (
    <Flex
      sx={{
        position: "fixed",
        height: "100vh",
        zIndex: "1000000",
        width: "100%",
        top: "0px",
        bg: "#ffffff",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        transition: "left .3s ease-in-out",
        left: isOpen ? "0px" : "-100%",
      }}
    >
      <Box sx={{ width: "90%" }}>
        <Flex
          sx={{
            width: "100%",
            justifyContent: "space-between",
            height: "60px",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            sx={{ color: "primary", width: "60px" }}
            onClick={handleLinkClick}
          >
            <StaticImage alt="logo" src="../../images/logo_2.png" />
          </Link>
          <CloseButton
            sx={{
              position: "absolute",
              cursor: "pointer",
            }}
            onClick={() => {
              setSideNavOpen(false);
              enableScrollFunc();
            }}
          />
        </Flex>
        <Flex
          sx={{
            mt: 4,
            flexDirection: "column",
            color: "primary",
            alignItems: "center",
            a: { mb: 3 },
          }}
        >
          <Link
            to="/"
            sx={{
              color: "primary",
              textDecoration: "none",
              fontSize: 4,
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleLinkClick}
          >
            {t("nav_home")}
          </Link>
          <Link
            to="/blog"
            sx={{
              color: "primary",
              textDecoration: "none",
              fontSize: 4,
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleLinkClick}
          >
            {t("nav_blog")}
          </Link>
          <Link
            to="/contact"
            sx={{
              color: "primary",
              textDecoration: "none",
              fontSize: 4,
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleLinkClick}
          >
            {t("nav_contact")}
          </Link>
          <Link
            to="/projects"
            sx={{
              color: "primary",
              textDecoration: "none",
              fontSize: 4,
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleLinkClick}
          >
            {t("nav_projects")}
          </Link>
          <Link
            to="/about"
            sx={{
              color: "primary",
              textDecoration: "none",
              fontSize: 4,
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleLinkClick}
          >
            {t("nav_about")}
          </Link>
          <Link
            to="/climbing"
            sx={{
              color: "primary",
              textDecoration: "none",
              fontSize: 4,
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleLinkClick}
          >
            {t("nav_climbing")}
          </Link>
        </Flex>
        <BuildStatus isScrolledTop={false} />
      </Box>
    </Flex>
  );
};

export default SideNav;
