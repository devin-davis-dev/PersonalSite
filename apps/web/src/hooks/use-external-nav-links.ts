import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useMemo } from "react";

export interface ExternalNavLinkItem {
  to: string;
  label: string;
  external: true;
  icon?: IconDefinition;
}

export const useExternalNavLinks = (): ExternalNavLinkItem[] => {
  return useMemo(
    () => [
      {
        to: "https://www.linkedin.com/in/devin-dev-d-63008412b",
        label: "LinkedIn",
        external: true,
        icon: faLinkedin,
      },
      {
        to: "https://www.instagram.com/devindavis732/",
        label: "Instagram",
        external: true,
        icon: faInstagram,
      },
    ],
    [],
  );
};
