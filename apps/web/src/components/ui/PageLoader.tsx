import { Flex } from "theme-ui";
import { Loader } from "./Loader";

export const PageLoader = () => (
  <Flex
    sx={{
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <Loader />
  </Flex>
);
