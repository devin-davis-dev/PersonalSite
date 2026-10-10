import { Flex } from "theme-ui";

const Shadow = ({ children }) => {
  return (
    <Flex
      sx={{
        position: "fixed",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        bg: "#00000070",
        zIndex: 10000,
      }}
    >
      {children}
    </Flex>
  );
};

export default Shadow;
