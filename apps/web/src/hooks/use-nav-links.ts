import { useTranslation } from "gatsby-plugin-react-i18next";
import { useMemo } from "react";

export interface NavLinkItem {
  to: string;
  label: string;
  external?: boolean;
}

export {
  useExternalNavLinks,
  type ExternalNavLinkItem,
} from "./use-external-nav-links";

export const useNavLinks = (): NavLinkItem[] => {
  const { t } = useTranslation("common");

  return useMemo(
    () => [
      { to: "/contact", label: t("nav_contact") },
      { to: "/about", label: t("nav_about") },
      { to: "/projects", label: t("nav_projects") },
      { to: "/blog", label: t("nav_blog") },
      { to: "/climbing", label: t("nav_climbing") },
    ],
    [t],
  );
};
