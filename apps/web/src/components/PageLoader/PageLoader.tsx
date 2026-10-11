import { Flex } from "theme-ui";
import Loader from "../Loader";

const PageLoader = () => (
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

export default PageLoader;
