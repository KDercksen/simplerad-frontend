import { HStack } from "@chakra-ui/react";
import ColorModeSwitchButton from "./ColorModeSwitchButton";
import ApiHealthCheck from "./ApiHealthCheck";

export default function StatusBar(props) {
  return (
    <HStack {...props}>
      <ApiHealthCheck />
      <ColorModeSwitchButton ml={3} />
    </HStack>
  );
}
