import { HStack } from "@chakra-ui/react";
import ApiHealthCheck from "./ApiHealthCheck";

export default function StatusBar(props) {
  return (
    <HStack {...props}>
      <ApiHealthCheck />
    </HStack>
  );
}
