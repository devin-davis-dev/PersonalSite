import { useTranslation } from "gatsby-plugin-react-i18next";
import { useMemo } from "react";

export interface NavLinkItem {
  to: string;
  label: string;
  external?: boolean;
}

export const useNavLinks = (): NavLinkItem[] => {
  const { t } = useTranslation("common");

  return useMemo(
    () => [
      { to: "/blog", label: t("nav_blog") },
      { to: "/projects", label: t("nav_projects") },
      { to: "/about", label: t("nav_about") },
      { to: "/contact", label: t("nav_contact") },
      { to: "/climbing", label: t("nav_climbing") },
      {
        to: "https://www.linkedin.com/in/devin-dev-d-63008412b",
        label: "LinkedIn",
        external: true,
      },
    ],
    [t],
  );
};
