import { StaticImage } from "gatsby-plugin-image";
import { Link } from "gatsby-plugin-react-i18next";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Link as ThemeLink,
  type ThemeUIStyleObject,
} from "theme-ui";
import { useNavLinks } from "../../hooks/use-nav-links";
import BuildStatus from "../BuildStatus/BuildStatus";
import ConnectWallet from "../ConnectWallet";
import SideNav from "./SideNav";

const Navbar = () => {
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navLinks = useNavLinks();

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

  const navLinkStyle: ThemeUIStyleObject = {
    mr: 3,
    color: !isScrolledTop ? "#30362F" : "white",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "color 0.2s ease-in-out",
    "&:hover": {
      color: "orange",
      textDecoration: "underline",
    },
  };

  return (
    <Box as="nav" sx={nav}>
      <Flex
        data-testid="navbar-wrapper"
        sx={navWrapper}
        style={{ backgroundColor: !isScrolledTop ? "#ffffffe6" : undefined }}
      >
        <SideNav
          isOpen={sideNavOpen}
          setSideNavOpen={setSideNavOpen}
          enableScrollFunc={enableScroll}
        />
        <Box
          data-testid="navbar-desktop-container"
          sx={{
            width: ["90%", "80%", "70%"],
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Flex sx={{ alignItems: "center" }}>
            <Link to="/" sx={{ width: "60px", mr: [0, 4], flexShrink: 0 }}>
              <Box className="nav-triangle" />
              <Box sx={{ filter: isScrolledTop ? "none" : "brightness(0)" }}>
                <StaticImage alt="logo" src="../../images/logo.png" />
              </Box>
              <Box className="nav-triangle" />
            </Link>
            <Flex
              data-testid="desktop-links"
              sx={{
                display: ["none", "none", "none", "flex"],
                alignItems: "center",
                color: "white",
              }}
            >
              {navLinks.map((link, index) => {
                const isLast = index === navLinks.length - 1;
                const sx = {
                  ...navLinkStyle,
                  mr: isLast ? 0 : 3,
                };

                if (link.external) {
                  return (
                    <ThemeLink
                      key={link.to}
                      sx={sx}
                      target="_blank"
                      href={link.to}
                    >
                      {link.label}
                    </ThemeLink>
                  );
                }

                return (
                  <Link key={link.to} to={link.to} sx={sx}>
                    {link.label}
                  </Link>
                );
              })}
            </Flex>
          </Flex>
          <Flex sx={{ alignItems: "center" }}>
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
                display: ["none", "none", "none", "flex"],
                alignItems: "center",
                color: "white",
              }}
            >
              <BuildStatus isScrolledTop={isScrolledTop} sx={{ mr: 3 }} />
              <ConnectWallet isScrolledTop={isScrolledTop} />
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

const nav: ThemeUIStyleObject = {
  top: "0px",
  left: "0px",
  position: "fixed",
  width: "100%",
  zIndex: "100",
};

const navWrapper: ThemeUIStyleObject = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "primary",
  backdropFilter: "blur(10px)",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
  transition: "background-color .3s",
  i: {
    fontSize: "2em",
  },
};

const hamburgerStyles: ThemeUIStyleObject = {
  width: "30px",
  height: "25px",
  flexDirection: "column",
  justifyContent: "space-between",
  cursor: "pointer",
  display: ["flex", "flex", "flex", "none"],
};

const hamburderPatty: ThemeUIStyleObject = {
  height: "4px",
  width: "100%",
  backgroundColor: "white",
};

export default memo(Navbar);
