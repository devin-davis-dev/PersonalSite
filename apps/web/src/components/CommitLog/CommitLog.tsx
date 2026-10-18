import { useTranslation } from "gatsby-plugin-react-i18next";
import { DateTime } from "luxon";
import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Link,
  Text,
  type ThemeUIStyleObject,
} from "theme-ui";
import { colors } from "../../theme/theme";
import type { Commit } from "../../types";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
  ];

  for (const { unit, seconds: intervalSeconds } of intervals) {
    const count = Math.floor(seconds / intervalSeconds);
    if (count >= 1) {
      return `${count} ${unit}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

const wrapperStyles: ThemeUIStyleObject = {
  bg: "rgba(255, 255, 255, 0.08)",
  borderRadius: 8,
  width: "100%",
  flexShrink: 0,
  overflowY: "auto",
  scrollbarWidth: "thin",
  scrollbarColor: `${colors.orange} rgba(255,255,255,0.1)`,
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    bg: "rgba(255,255,255,0.1)",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb": {
    bg: "orange",
    borderRadius: "3px",
  },
};

interface CommitLogProps {
  commits: Commit[];
}

export default function CommitLog({ commits }: CommitLogProps) {
  const { t, i18n } = useTranslation("common");
  const [open, setOpen] = useState(false);

  const formatRelativeTime = (dateString: string) => {
    try {
      const dt = DateTime.fromISO(dateString);
      if (dt.isValid) {
        return dt.setLocale(i18n.language).toRelative() || timeAgo(dateString);
      }
    } catch {
      // fallback
    }
    return timeAgo(dateString);
  };

  return (
    <Box sx={wrapperStyles}>
      <Flex
        onClick={() => setOpen(!open)}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          p: 3,
          userSelect: "none",
        }}
      >
        <Heading
          as="h3"
          sx={{ fontSize: 1, color: "orange", fontStyle: "normal", m: 0 }}
        >
          {t("recent_commits")}
        </Heading>
        <Text
          sx={{
            color: "orange",
            fontSize: 1,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </Text>
      </Flex>
      {open && (
        <Box as="ul" sx={{ listStyle: "none", p: 0, m: 0, px: 3, pb: 3 }}>
          {commits.map((commit) => (
            <Box
              as="li"
              key={commit.sha}
              sx={{
                py: 2,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <Link
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontSize: 0,
                  color: "white",
                  fontWeight: "bold",
                  mb: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "wrap",
                  display: "block",
                  textDecoration: "none",
                  "&:hover": { color: "orange" },
                }}
              >
                {commit.message}
              </Link>
              <Text
                sx={{
                  fontSize: 0,
                  color: "rgba(255,255,255,0.5)",
                  display: "block",
                  mt: 1,
                }}
              >
                {commit.author} &middot; {formatRelativeTime(commit.date)}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
