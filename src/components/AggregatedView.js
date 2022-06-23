import AutomaticSummary from "./AutomaticSummary";
import EntityInfo from "./EntityInfo";
import ReportEditDisplayTabs from "./ReportEditDisplayTabs";
import { HStack, Spacer, VStack } from "@chakra-ui/react";
import { useState } from "react";

export default function AggregatedView(props) {
  const [request, setRequest] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);

  return (
    <VStack w="full" h="100%">
      <HStack justify="flex-start" align="flex-start" w="full">
        <ReportEditDisplayTabs
          w="70%"
          minHeight="465px"
          borderWidth={3}
          borderRadius={10}
          // custom props
          onProcessRequest={setRequest}
          onEntitySelect={setSelectedEntity}
        />
        {/* <VStack h="full"> */}
        <EntityInfo
          h="300px"
          overflow="auto"
          w="30%"
          p={3}
          borderWidth={3}
          borderRadius={10}
          selectedEntity={selectedEntity}
        />
        {/* </VStack> */}
      </HStack>
      {/* NOTE: the below 'pr' is unnecessary when more items are added */}
      <HStack pr={2} w="full" align="flex-start" justify="flex-start">
        <AutomaticSummary
          p={3}
          w="70%"
          borderWidth={3}
          borderRadius={10}
          overflow="auto"
          request={request}
        />
        <Spacer w="30%" />
      </HStack>
    </VStack>
  );
}
