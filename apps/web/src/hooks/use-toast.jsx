import { useCallback, useEffect, useState } from "react";
import { Box, Text } from "theme-ui";

function useToast({ duration = 5000 } = {}) {
  const [toast, setToast] = useState(null);
  const [isFading, setIsFading] = useState(false);

  const showToast = useCallback((message, variant = "error") => {
    setToast({ message, variant });
    setIsFading(false);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
    setIsFading(false);
  }, []);

  useEffect(() => {
    if (toast) {
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, duration - 300);
      const removeTimer = setTimeout(() => {
        setToast(null);
        setIsFading(false);
      }, duration);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [toast, duration]);

  const variants = {
    error: {
      bg: "#fee2e2",
      border: "1px solid #ef4444",
      color: "#dc2626",
    },
    success: {
      bg: "#dcfce7",
      border: "1px solid #22c55e",
      color: "#16a34a",
    },
  };

  const Toast = toast ? (
    <Box
      sx={{
        position: "fixed",
        top: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 99,
        borderRadius: 4,
        p: 3,
        width: ["90%", "80%", "50%"],
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        animation: isFading
          ? "slideOut 0.3s ease-in forwards"
          : "slideIn 0.3s ease-out",
        "@keyframes slideIn": {
          from: {
            opacity: 0,
            transform: "translateX(-50%) translateY(-20px)",
          },
          to: {
            opacity: 1,
            transform: "translateX(-50%) translateY(0)",
          },
        },
        "@keyframes slideOut": {
          from: {
            opacity: 1,
            transform: "translateX(-50%) translateY(0)",
          },
          to: {
            opacity: 0,
            transform: "translateX(-50%) translateY(-20px)",
          },
        },
        ...variants[toast.variant],
      }}
    >
      <Text sx={{ color: variants[toast.variant].color }}>{toast.message}</Text>
    </Box>
  ) : null;

  return { showToast, hideToast, Toast };
}

export default useToast;
