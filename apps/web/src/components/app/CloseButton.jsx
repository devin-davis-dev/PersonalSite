import { Box, Flex } from "theme-ui";

export function CloseButton({ onClick, sx }) {
  return (
    <Flex
      onClick={(e) => onClick(e)}
      href="/"
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
