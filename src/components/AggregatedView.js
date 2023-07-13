import AutomaticSummary from "./AutomaticSummary";
import EntityInfo from "./EntityInfo";
import ReportEditDisplayTabs from "./ReportEditDisplayTabs";
import Prevalence from "./Prevalence";
import { HStack, Spacer, VStack } from "@chakra-ui/react";
import { useState } from "react";

export default function AggregatedView(props) {
  const [reportText, setReportText] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedSentence, setSelectedSentence] = useState(null);

  const handleReportSubmit = (reportText) => {
    setReportText(reportText);
  };

  return (
    <HStack w="full" h="100%">
      <VStack h="full" w="70%">
        <ReportEditDisplayTabs
          w="full"
          minHeight="600px"
          // custom props
          onProcessRequest={handleReportSubmit}
          onEntitySelect={setSelectedEntity}
          onSentenceSelect={setSelectedSentence}
          borderWidth={3}
          borderRadius={10}
          borderColor="umc.grijs3"
        />
        <AutomaticSummary
          p={3}
          w="full"
          overflow="auto"
          reportText={reportText}
          borderWidth={3}
          borderRadius={10}
          borderColor="umc.grijs3"
        />
      </VStack>
      <VStack w="30%" h="full">
        <EntityInfo
          h="300px"
          overflow="auto"
          w="full"
          p={3}
          selectedEntity={selectedEntity}
          borderWidth={3}
          borderRadius={10}
          borderColor="umc.grijs3"
        />
        <Prevalence
          minH="260px"
          w="full"
          p={3}
          selectedSentence={selectedSentence}
          reportText={reportText}
          borderWidth={3}
          borderRadius={10}
          borderColor="umc.grijs3"
        />
        <Spacer />
      </VStack>
    </HStack>
  );
}
