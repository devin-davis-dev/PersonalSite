import { keyframes } from "@emotion/react";
import { useTranslation } from "gatsby-plugin-react-i18next";
/** @jsxImportSource theme-ui */
import { useEffect, useState } from "react";
import { Box, Flex } from "theme-ui";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const STATUS_CONFIG = {
  ready: { color: "#4CAF50", translationKey: "build_status_live" },
  building: { color: "#FFA630", translationKey: "build_status_building" },
  enqueued: { color: "#FFA630", translationKey: "build_status_building" },
  error: { color: "#E53E3E", translationKey: "build_status_error" },
};

const POLL_INTERVAL = 30000;

const BuildStatus = ({ isScrolledTop = true }) => {
  const { t } = useTranslation("common");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchStatus = async () => {
      try {
        const res = await fetch("/.netlify/functions/deploy-status");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (mounted) setStatus(data.state);
      } catch {
        if (mounted) setStatus(null);
      }
    };

    fetchStatus();
    const timer = setInterval(fetchStatus, POLL_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  if (!status || !STATUS_CONFIG[status]) return null;

  const { color, translationKey } = STATUS_CONFIG[status];
  const isAnimated = status === "building" || status === "enqueued";
  const textColor = isScrolledTop ? "white" : "#30362F";

  return (
    <Flex sx={{ alignItems: "center", gap: "6px", ml: 3 }}>
      <Box
        sx={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: color,
          flexShrink: 0,
          animation: isAnimated ? `${pulse} 1.5s ease-in-out infinite` : "none",
        }}
      />
      <Box
        sx={{
          fontSize: "0.75rem",
          fontWeight: "bold",
          color: textColor,
          whiteSpace: "nowrap",
        }}
      >
        {t(translationKey)}
      </Box>
    </Flex>
  );
};

export default BuildStatus;
