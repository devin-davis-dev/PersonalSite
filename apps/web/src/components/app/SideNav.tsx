import { StaticImage } from "gatsby-plugin-image";
import { Link } from "gatsby-plugin-react-i18next";
import { Box, Flex, Link as ThemeLink } from "theme-ui";
import { useNavLinks } from "../../hooks/use-nav-links";
import BuildStatus from "../BuildStatus/BuildStatus";
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
          {navLinks.map((link) => {
            const commonProps = {
              sx: {
                color: "primary",
                textDecoration: "none",
                fontSize: 4,
                fontWeight: "bold",
                transition: "color 0.2s ease-in-out",
                "&:hover": {
                  color: "orange",
                  textDecoration: "underline",
                },
              },
              onClick: handleLinkClick,
            };

            if (link.external) {
              return (
                <ThemeLink
                  key={link.to}
                  {...commonProps}
                  target="_blank"
                  href={link.to}
                >
                  {link.label}
                </ThemeLink>
              );
            }

            return (
              <Link key={link.to} {...commonProps} to={link.to}>
                {link.label}
              </Link>
            );
          })}
        </Flex>
        <Flex sx={{ justifyContent: "center", mb: 3 }}>
          <ConnectWallet isScrolledTop={false} />
        </Flex>
        <BuildStatus isScrolledTop={false} sx={{ justifyContent: "center" }} />
      </Box>
    </Flex>
  );
};

export default SideNav;
