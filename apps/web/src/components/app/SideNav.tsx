import {
  faArrowUpRightFromSquare,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { StaticImage } from "gatsby-plugin-image";
import { Link } from "gatsby-plugin-react-i18next";
import { Box, Flex, Text, Link as ThemeLink } from "theme-ui";
import { useNavLinks } from "../../hooks/use-nav-links";
import ConnectWallet from "../ConnectWallet";
import { CloseButton } from "./CloseButton";

interface SideNavProps {
  isOpen: boolean;
  setSideNavOpen: (open: boolean) => void;
  enableScrollFunc: () => void;
}

const SideNav = ({
  isOpen,
  setSideNavOpen,
  enableScrollFunc,
}: SideNavProps) => {
  const navLinks = useNavLinks();
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
        bg: "rgba(245, 245, 245, 0.99)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.25)",
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
            mt: 3,
            flexDirection: "column",
            gap: 1,
            width: "100%",
          }}
        >
          {navLinks.map((link) => {
            const rowStyles = {
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              py: "12px",
              px: "16px",
              borderRadius: "12px",
              color: "primary",
              textDecoration: "none",
              fontSize: 3,
              fontWeight: "bold",
              transition: "all 0.2s ease-in-out",
              "&:hover, &:active": {
                bg: "lightOrange",
                color: "orange",
              },
            };

            const linkContent = (
              <>
                <Text as="span">{link.label}</Text>
                <Icon
                  icon={
                    link.external ? faArrowUpRightFromSquare : faChevronRight
                  }
                  aria-hidden={true}
                  sx={{
                    fontSize: link.external ? "0.875rem" : "0.75rem",
                    opacity: 0.4,
                    color: "inherit",
                    transition: "transform 0.2s ease, opacity 0.2s ease",
                  }}
                />
              </>
            );

            if (link.external) {
              return (
                <ThemeLink
                  key={link.to}
                  sx={rowStyles}
                  target="_blank"
                  href={link.to}
                  onClick={handleLinkClick}
                >
                  {linkContent}
                </ThemeLink>
              );
            }

            return (
              <Link
                key={link.to}
                sx={rowStyles}
                to={link.to}
                onClick={handleLinkClick}
              >
                {linkContent}
              </Link>
            );
          })}
        </Flex>
        <Flex sx={{ justifyContent: "center", mt: 4, mb: 3 }}>
          <ConnectWallet isScrolledTop={false} size="large" />
        </Flex>
      </Box>
    </Flex>
  );
};

export default SideNav;
