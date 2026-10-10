import { StaticImage } from "gatsby-plugin-image";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Box, Flex, Link as ThemeLink } from "theme-ui";
import BuildStatus from "../BuildStatus/BuildStatus";
import SideNav from "./SideNav";

const Navbar = () => {
  const { t } = useTranslation("common");
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const styleNavBar = useCallback(() => {
    if (scrollTimeoutRef.current) {
      return;
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (window.scrollY < 20) {
        setIsScrolledTop(true);
      } else {
        setIsScrolledTop(false);
      }
      scrollTimeoutRef.current = null;
    }, 16);
  }, []);

  function disableScroll() {
    const x = window.scrollX;
    const y = window.scrollY;
    window.onscroll = () => {
      window.scrollTo(x, y);
    };
  }

  function enableScroll() {
    window.onscroll = () => {};
  }

  useEffect(() => {
    window.addEventListener("scroll", styleNavBar, { passive: true });

    return function removeScrollListener() {
      window.removeEventListener("scroll", styleNavBar);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [styleNavBar]);

  return (
    <Box as="nav" sx={nav}>
      <Flex
        sx={navWrapper}
        style={{ backgroundColor: !isScrolledTop ? "#ffffffe6" : null }}
      >
        <SideNav
          isOpen={sideNavOpen}
          setSideNavOpen={setSideNavOpen}
          enableScrollFunc={enableScroll}
        />
        <Box
          sx={{
            width: "90%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: ["none", "block"], color: "white" }}>
            <Link
              to="/blog"
              sx={{
                mr: 3,
                color: !isScrolledTop ? "#30362F" : "white",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("nav_blog")}
            </Link>
            <Link
              to="/contact"
              sx={{
                mr: 3,
                color: !isScrolledTop ? "#30362F" : "white",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("nav_contact")}
            </Link>
            <Link
              to="/climbing"
              sx={{
                color: !isScrolledTop ? "#30362F" : "white",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("nav_climbing")}
            </Link>
          </Box>
          <Link to="/" sx={{ width: "60px" }}>
            <Box className="nav-triangle" />
            <Box sx={{ filter: isScrolledTop ? "none" : "brightness(0)" }}>
              <StaticImage alt="logo" src="../../images/logo.png" />
            </Box>
            <Box className="nav-triangle" />
          </Link>
          <Box
            sx={hamburgerStyles}
            onClick={() => {
              setSideNavOpen(true);
              disableScroll();
            }}
          >
            <div
              sx={{
                ...hamburderPatty,
                backgroundColor: isScrolledTop ? "#ffffff" : "#30362F",
              }}
            />
            <div
              sx={{
                ...hamburderPatty,
                backgroundColor: isScrolledTop ? "#ffffff" : "#30362F",
              }}
            />
            <div
              sx={{
                ...hamburderPatty,
                backgroundColor: isScrolledTop ? "#ffffff" : "#30362F",
              }}
            />
          </Box>
          <Flex
            sx={{
              display: ["none", "flex"],
              alignItems: "center",
              color: "white",
            }}
          >
            <Link
              to="/projects"
              sx={{
                mr: 3,
                color: !isScrolledTop ? "#30362F" : "white",
                textDecoration: "none",
                fontWeight: "bold",
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
                color: !isScrolledTop ? "#30362F" : "white",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("nav_about")}
            </Link>
            <ThemeLink
              sx={{
                ml: 3,
                fontWeight: "bold",
                color: !isScrolledTop ? "#30362F" : "white",
              }}
              target="_blank"
              href="https://www.linkedin.com/in/devin-dev-d-63008412b"
              variant="footer"
            >
              LinkedIn
            </ThemeLink>
            <BuildStatus isScrolledTop={isScrolledTop} />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

const nav = {
  top: "0px",
  left: "0px",
  position: "fixed",
  width: "100%",
  zIndex: "100",
};

const navWrapper = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "primary",
  "-webkit-backdrop-filter": "blur(10px)",
  backdropFilter: "blur(10px)",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
  transition: "background-color .3s",
  i: {
    fontSize: "2em",
  },
};

const hamburgerStyles = {
  width: "30px",
  height: "25px",
  flexDirection: "column",
  justifyContent: "space-between",
  cursor: "pointer",
  display: ["flex", "none"],
};

const hamburderPatty = {
  height: "4px",
  width: "100%",
  backgroundColor: "white",
};

export default memo(Navbar);
