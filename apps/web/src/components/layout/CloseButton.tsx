import type React from "react";
import { Box, Flex } from "theme-ui";

interface CloseButtonProps {
  onClick: React.MouseEventHandler<any>;
  sx?: any;
}

export function CloseButton({ onClick, sx }: CloseButtonProps) {
  return (
    <Flex
      onClick={onClick}
      sx={{
        cursor: "pointer",
        position: "relative",
        width: "30px",
        height: "30px",
        justifyContent: "center",
        alignItems: "center",
        ...sx,
      }}
    >
      <Box
        sx={{
          bg: "primary",
          height: "5px",
          width: "30px",
          transform: "rotate(45deg)",
          position: "absolute",
        }}
      />
      <Box
        sx={{
          bg: "primary",
          height: "5px",
          width: "30px",
          transform: "rotate(-45deg)",
          position: "absolute",
        }}
      />
    </Flex>
  );
}
