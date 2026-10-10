import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Text } from "theme-ui";

export default function Tooltip({ text, variant = "dark" }) {
  const isLight = variant === "light";
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({
    horizontal: "center",
    vertical: "top",
  });
  const [buttonRect, setButtonRect] = useState(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  const calculatePosition = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setButtonRect(rect);

    const tooltipWidth = 280;
    const tooltipHeight = 100;
    const padding = 16;

    let horizontal = "center";
    let vertical = "top";

    // Check horizontal position
    const spaceLeft = rect.left;
    const spaceRight = window.innerWidth - rect.right;

    if (spaceRight < tooltipWidth / 2 + padding) {
      horizontal = "right";
    } else if (spaceLeft < tooltipWidth / 2 + padding) {
      horizontal = "left";
    }

    // Check vertical position
    const spaceTop = rect.top;
    if (spaceTop < tooltipHeight + padding) {
      vertical = "bottom";
    }

    setPosition({ horizontal, vertical });
  }, []);

  const handleShow = useCallback(() => {
    calculatePosition();
    setIsVisible(true);
  }, [calculatePosition]);

  const handleHide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleToggle = useCallback(() => {
    if (!isVisible) {
      calculatePosition();
    }
    setIsVisible((prev) => !prev);
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      setIsVisible(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  const getTooltipStyles = () => {
    const mobileTop = buttonRect
      ? position.vertical === "top"
        ? `${buttonRect.top - 8}px`
        : `${buttonRect.bottom + 8}px`
      : "50%";

    const mobileTransform =
      position.vertical === "top" ? "translateY(-100%)" : "none";

    const base = {
      position: ["fixed", "absolute"],
      backgroundColor: "primary",
      color: "white",
      padding: 3,
      borderRadius: "8px",
      fontSize: 1,
      width: ["calc(100vw - 32px)", "280px"],
      maxWidth: ["none", "280px"],
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? "visible" : "hidden",
      transition: "opacity 0.2s ease, visibility 0.2s ease",
      zIndex: 1000,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      pointerEvents: isVisible ? "auto" : "none",
      left: ["16px", "auto"],
      right: ["16px", "auto"],
      top: [mobileTop, "auto"],
      bottom: ["auto", "auto"],
      transform: [mobileTransform, "none"],
    };

    // Desktop positioning
    if (position.vertical === "top") {
      base.bottom = ["auto", "calc(100% + 8px)"];
      base.top = [mobileTop, "auto"];
    } else {
      base.top = [mobileTop, "calc(100% + 8px)"];
      base.bottom = ["auto", "auto"];
    }

    if (position.horizontal === "center") {
      base.left = ["16px", "50%"];
      base.transform = [mobileTransform, "translateX(-50%)"];
    } else if (position.horizontal === "right") {
      base.right = ["16px", 0];
      base.left = ["16px", "auto"];
    } else {
      base.left = ["16px", 0];
      base.right = ["16px", "auto"];
    }

    return base;
  };

  const getArrowStyles = () => {
    const base = {
      content: '""',
      position: "absolute",
      border: "6px solid transparent",
      display: ["none", "block"],
    };

    // Vertical positioning
    if (position.vertical === "top") {
      base.top = "100%";
      base.borderTopColor = "primary";
    } else {
      base.bottom = "100%";
      base.borderBottomColor = "primary";
    }

    // Horizontal positioning
    if (position.horizontal === "center") {
      base.left = "50%";
      base.transform = "translateX(-50%)";
    } else if (position.horizontal === "right") {
      base.right = "10px";
    } else {
      base.left = "10px";
    }

    return base;
  };

  return (
    <Box
      ref={containerRef}
      className="tooltip-container"
      sx={{
        position: "relative",
        display: "inline-block",
      }}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onClick={handleToggle}
    >
      <button
        type="button"
        sx={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: "2px solid",
          borderColor: isLight ? "white" : "primary",
          backgroundColor: "transparent",
          color: isLight ? "white" : "primary",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "bold",
          cursor: "pointer",
          userSelect: "none",
          padding: 0,
          opacity: isLight ? 0.7 : 1,
          outline: "none",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: ["44px", "20px"],
            height: ["44px", "20px"],
            borderRadius: "50%",
          },
          "&:hover": {
            opacity: 1,
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: isLight ? "white" : "primary",
            outlineOffset: "2px",
          },
        }}
        aria-label="More information"
      >
        ?
      </button>
      {buttonRect && (
        <Box
          ref={tooltipRef}
          className="tooltip"
          sx={{
            ...getTooltipStyles(),
            "&::after": getArrowStyles(),
          }}
        >
          <Text sx={{ fontSize: 1, lineHeight: 1.4 }}>{text}</Text>
        </Box>
      )}
    </Box>
  );
}
