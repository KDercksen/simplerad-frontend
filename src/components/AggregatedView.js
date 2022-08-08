import AutomaticSummary from "./AutomaticSummary";
import EntityInfo from "./EntityInfo";
import ReportEditDisplayTabs from "./ReportEditDisplayTabs";
import EntityFrequency from "./EntityFrequency.js";
import { HStack, Spacer, VStack } from "@chakra-ui/react";
import { useState } from "react";

export default function AggregatedView(props) {
  const [reportText, setReportText] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const handleReportSubmit = (reportText) => {
    setReportText(reportText);
  };

  return (
    <VStack w="full" h="100%">
      <HStack justify="flex-start" align="flex-start" w="full">
        <ReportEditDisplayTabs
          w="70%"
          minHeight="465px"
          borderWidth={3}
          borderRadius={10}
          // custom props
          onProcessRequest={handleReportSubmit}
          onEntitySelect={setSelectedEntity}
        />
        <VStack w="30%" h="full">
          <EntityInfo
            h="300px"
            overflow="auto"
            w="full"
            p={3}
            borderWidth={3}
            borderRadius={10}
            selectedEntity={selectedEntity}
          />
          <EntityFrequency
            h="110px"
            overflow="hidden"
            w="full"
            p={3}
            borderWidth={3}
            borderRadius={10}
            selectedEntity={selectedEntity}
          />
        </VStack>
      </HStack>
      {/* NOTE: the below 'pr' is unnecessary when more items are added */}
      <HStack pr={2} w="full" align="flex-start" justify="flex-start">
        <AutomaticSummary
          p={3}
          w="70%"
          borderWidth={3}
          borderRadius={10}
          overflow="auto"
          reportText={reportText}
        />
        <Spacer w="30%" />
      </HStack>
    </VStack>
  );
}
