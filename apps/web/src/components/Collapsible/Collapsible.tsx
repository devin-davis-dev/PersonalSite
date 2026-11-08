import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "gatsby-plugin-react-i18next";
import type React from "react";
import { useId, useState } from "react";
import { Box, Button, Flex, Text, type ThemeUIStyleObject } from "theme-ui";

const containerStyle = (isOpen: boolean): ThemeUIStyleObject => ({
  my: 4,
  borderRadius: "10px",
  border: "2px solid",
  borderColor: isOpen ? "orange" : "rgba(41, 46, 41, 0.2)",
  bg: "white",
  boxShadow: isOpen
    ? "0 4px 14px rgba(255, 166, 48, 0.2)"
    : "0 2px 6px rgba(0, 0, 0, 0.06)",
  overflow: "hidden",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
});

const buttonStyle = (isOpen: boolean): ThemeUIStyleObject => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 3,
  px: [3, 4],
  py: 3,
  borderRadius: 0,
  boxShadow: "none",
  transform: "none",
  bg: isOpen ? "primary" : "secondary",
  color: isOpen ? "white" : "primary",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "heading",
  fontWeight: "bold",
  fontSize: ["1rem", "1.125rem"],
  transition: "all 0.2s ease",
  userSelect: "none",
  "&:hover": {
    transform: "none",
    boxShadow: "none",
    bg: isOpen ? "primary" : "rgba(41, 46, 41, 0.08)",
    color: isOpen ? "orange" : "darkOrange",
  },
  "&:focus-visible": {
    outline: "2px solid",
    outlineColor: "orange",
    outlineOffset: "2px",
  },
});

const headerLeftContainerStyle: ThemeUIStyleObject = {
  alignItems: "center",
  gap: 2,
  flex: 1,
  minWidth: 0,
};

const badgeStyle = (isOpen: boolean): ThemeUIStyleObject => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  bg: isOpen ? "orange" : "primary",
  color: isOpen ? "#1A1A1A" : "white",
  fontSize: "0.75rem",
  fontFamily: "heading",
  fontWeight: "bold",
  lineHeight: 1,
  px: "8px",
  pt: "5px",
  pb: "4px",
  borderRadius: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  flexShrink: 0,
});

const headerTitleStyle: ThemeUIStyleObject = {
  fontWeight: "bold",
  fontSize: ["1rem", "1.125rem"],
  lineHeight: 1.3,
  color: "inherit",
  overflowWrap: "break-word",
};

const headerIconStyle = (isOpen: boolean): ThemeUIStyleObject => ({
  color: isOpen ? "orange" : "primary",
  fontSize: "1rem",
  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 0.2s ease, color 0.2s ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  ml: 2,
});

const contentWrapperStyle = (isOpen: boolean): ThemeUIStyleObject => ({
  display: isOpen ? "block" : "none",
  px: [3, 4],
  py: 4,
  bg: "white",
  color: "primary",
  borderTop: "1px solid",
  borderColor: "rgba(41, 46, 41, 0.12)",
  "& > *:first-of-type": {
    mt: 0,
  },
  "& > *:last-child": {
    mb: 0,
  },
  h3: {
    mt: 3,
    mb: 2,
    fontSize: "1.15rem",
    fontWeight: "bold",
    fontStyle: "normal",
    color: "primary",
  },
  ul: {
    pl: "24px",
    mb: 3,
  },
  li: {
    mb: 2,
    lineHeight: "1.6",
  },
  p: {
    mb: 3,
    lineHeight: "1.6",
  },
  code: {
    bg: "secondary",
    px: "6px",
    py: "2px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "0.9em",
    color: "primary",
  },
});

export interface CollapsibleProps {
  title?: string;
  summary?: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Collapsible({
  title,
  summary,
  badge,
  defaultOpen = false,
  children,
}: CollapsibleProps) {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const id = useId();
  const buttonId = `collapsible-button-${id}`;
  const contentId = `collapsible-content-${id}`;

  const headerTitle = title || summary || t("collapsible_default_title");

  return (
    <Box sx={containerStyle(isOpen)}>
      <Button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-label={
          isOpen
            ? `${headerTitle} - ${t("collapsible_collapse", "Collapse")}`
            : `${headerTitle} - ${t("collapsible_expand", "Expand")}`
        }
        onClick={() => setIsOpen((prev) => !prev)}
        sx={buttonStyle(isOpen)}
      >
        <Flex sx={headerLeftContainerStyle}>
          {badge && (
            <Text as="span" sx={badgeStyle(isOpen)}>
              {badge}
            </Text>
          )}
          <Text as="span" sx={headerTitleStyle}>
            {headerTitle}
          </Text>
        </Flex>
        <Box sx={headerIconStyle(isOpen)} aria-hidden="true">
          <Icon icon={faChevronDown} />
        </Box>
      </Button>
      <Box
        as="section"
        id={contentId}
        aria-labelledby={buttonId}
        hidden={!isOpen}
        sx={contentWrapperStyle(isOpen)}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Collapsible;
