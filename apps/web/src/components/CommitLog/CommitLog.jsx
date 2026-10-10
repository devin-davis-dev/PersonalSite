import { useState } from "react";
import { Box, Flex, Heading, Link, Text } from "theme-ui";

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

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

const wrapperStyles = {
  bg: "rgba(255, 255, 255, 0.08)",
  borderRadius: 8,
  width: "100%",
  flexShrink: 0,
  overflowY: "auto",
  scrollbarWidth: "thin",
  scrollbarColor: "#FFA630 rgba(255,255,255,0.1)",
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

export default function CommitLog({ commits }) {
  const [open, setOpen] = useState(false);

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
          Recent Commits
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
                {commit.author} &middot; {timeAgo(commit.date)}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
