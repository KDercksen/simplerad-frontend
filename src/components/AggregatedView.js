import AutomaticSummary from "./AutomaticSummary";
import EntityInfo from "./EntityInfo";
import ReportEditDisplayTabs from "./ReportEditDisplayTabs";
import EntityFrequency from "./EntityFrequency";
import GPT3EntityExplainer from "./GPT3EntityExplainer";
import { HStack, Spacer, VStack } from "@chakra-ui/react";
import { useState } from "react";

export default function AggregatedView(props) {
  const [reportText, setReportText] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const handleReportSubmit = (reportText) => {
    setReportText(reportText);
  };

  return (
    <HStack w="full" h="100%">
      <VStack h="full" w="70%">
        <ReportEditDisplayTabs
          w="full"
          minHeight="600px"
          borderWidth={3}
          borderRadius={10}
          // custom props
          onProcessRequest={handleReportSubmit}
          onEntitySelect={setSelectedEntity}
        />
        <AutomaticSummary
          p={3}
          w="full"
          borderWidth={3}
          borderRadius={10}
          overflow="auto"
          reportText={reportText}
        />
      </VStack>
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
        <GPT3EntityExplainer
          h="300px"
          overflow="auto"
          w="full"
          p={3}
          borderWidth={3}
          borderRadius={10}
          selectedEntity={selectedEntity}
        />
        <EntityFrequency
          h="130px"
          overflow="hidden"
          w="full"
          p={3}
          borderWidth={3}
          borderRadius={10}
          selectedEntity={selectedEntity}
        />
        <Spacer />
      </VStack>
    </HStack>
  );
}
