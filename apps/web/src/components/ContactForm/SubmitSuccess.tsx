import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { Link as I18nLink, useTranslation } from "gatsby-plugin-react-i18next";
import { useCallback } from "react";
import { Box, Button, Flex, Heading, Link, Text } from "theme-ui";

export interface SubmitSuccessProps {
  showToast: (message: string, variant?: "error" | "success") => void;
}

export const SubmitSuccess = ({ showToast }: SubmitSuccessProps) => {
  const { t } = useTranslation("contact");

  const copyPGP = useCallback(async () => {
    try {
      const response = await fetch("/pgp-key.asc");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      showToast(t("pgp_copy_success"), "success");
    } catch {
      showToast(t("pgp_copy_error"));
    }
  }, [showToast, t]);

  return (
    <Flex
      sx={{
        minHeight: "calc(100vh - 160px)",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Heading variant="large" sx={{ mb: 3 }}>
          {t("success_title")}
        </Heading>
        <Text variant="regular" sx={{ my: 3, display: "block" }}>
          {t("success_subtitle")}
        </Text>
        <Flex sx={{ gap: 3, alignItems: "center", mb: 3 }}>
          <Box>
            {t("success_pgp_text")}{" "}
            <Link
              variant="text"
              href="https://www.fortinet.com/resources/cyberglossary/pgp-encryption"
            >
              {t("success_pgp_learn")}
            </Link>{" "}
          </Box>
        </Flex>
        <Button variant="secondary" sx={{ mr: 2 }} onClick={copyPGP}>
          <Text>{t("success_pgp_button")}</Text>
          <Icon sx={{ ml: 2 }} icon={faCopy} />
        </Button>
        <I18nLink to="/">
          <Button variant="primary">{t("success_back_home")}</Button>
        </I18nLink>
      </Box>
    </Flex>
  );
};

export default SubmitSuccess;
