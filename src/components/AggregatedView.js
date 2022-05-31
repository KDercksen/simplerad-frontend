import AutomaticSummary from "./AutomaticSummary";
import EntityInfo from "./EntityInfo";
import ReportEditDisplayTabs from "./ReportEditDisplayTabs";
import { HStack, VStack } from "@chakra-ui/react";

export default function AggregatedView() {
  return (
    <VStack w="full" h="100%">
      <HStack justify="flex-start" align="flex-start" w="full">
        <ReportEditDisplayTabs w="70%" borderWidth={3} borderRadius={10} />
        {/* <VStack h="full"> */}
        <EntityInfo w="30%" p={3} borderWidth={3} borderRadius={10} />
        {/* </VStack> */}
      </HStack>
      <HStack w="full" align="flex-start" justify="flex-start">
        <AutomaticSummary p={3} w="70%" borderWidth={3} borderRadius={10} />
      </HStack>
    </VStack>
  );
}
