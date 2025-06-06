import {
  Box,
  CircularProgress,
  Stat,
  HStack,
  StatNumber,
  StatLabel,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { FaQuestionCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { theme } from "../theme.js";

const prevalenceScoreToText = (score) => {
  if (score < 0.05) {
    return "very rare";
  } else if (score < 0.1) {
    return "rare";
  } else if (score < 0.2) {
    return "common";
  } else {
    return "very common";
  }
};

const certaintyScoreToText = (score) => {
  if (score < 0.2) {
    return "very uncertain";
  } else if (score < 0.4) {
    return "uncertain";
  } else if (score < 0.6) {
    return "likely";
  } else {
    return "very certain";
  }
};

export default function Prevalence({ selectedSentence, reportText, ...props }) {
  const [globalPrevalence, setGlobalPrevalence] = useState(null);
  const [globalCertainty, setGlobalCertainty] = useState(null);
  const [localPrevalence, setLocalPrevalence] = useState(null);
  const [localCertainty, setLocalCertainty] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleGlobalSearch(term) {
      axios
        .post(process.env.REACT_APP_PREVALENCE_ENDPOINT + "global/", [
          { text: term },
        ])
        .then((r) => {
          // set prevalence values
          setGlobalPrevalence(r.data[0].prevalence);
          setGlobalCertainty(r.data[0].certainty);
        })
        .catch((e) => {
          // prevalence values
          setGlobalPrevalence(null);
          // certainty values
          setGlobalCertainty(null);
          console.log(e);
        });
    }
    function handleLocalSearch(term, context) {
      axios
        .post(process.env.REACT_APP_PREVALENCE_ENDPOINT + "local/", [
          { text: term, context: context },
        ])
        .then((r) => {
          setLocalPrevalence(r.data[0].prevalence);
          setLocalCertainty(r.data[0].certainty);
        })
        .catch((e) => {
          setLocalPrevalence(null);
          setLocalCertainty(null);
          console.log(e);
        });
    }
    if (!(selectedSentence === null || selectedSentence === "")) {
      setLoading(true);
      handleGlobalSearch(selectedSentence);
      handleLocalSearch(selectedSentence, reportText);
      setLoading(false);
    }
  }, [selectedSentence, reportText]);

  function content() {
    // prevalence values are either all null or not, so just checking one of them is enough here.
    if (selectedSentence === null) {
      return (
        <Text color="umc.grijs2">
          Select any sentence to view prevalence information.
        </Text>
      );
    } else {
      if (loading || globalPrevalence === null || localPrevalence === null) {
        console.log("loading");
        return <CircularProgress isIndeterminate />;
      } else {
        return (
          <>
            <Text fontWeight="bold">Query:</Text>
            <Text color="umc.grijs2">{selectedSentence}</Text>
            <Text fontWeight="bold" py={2}>
              Prevalence statistics:
            </Text>
            <HStack spacing={8} w="100%">
              <Box w="100%" p={3} borderWidth={1} borderRadius={5}>
                <HStack spacing={1}>
                  <Tooltip label="How often do similar findings occur in patient reports regardless of context?">
                    <span>
                      <FaQuestionCircle color={theme.colors.umc.donkerblauw} />
                    </span>
                  </Tooltip>
                  <Text fontWeight="bold">Global:</Text>
                </HStack>
                <Stat>
                  <StatNumber fontSize="3xl">
                    {prevalenceScoreToText(globalPrevalence)}
                  </StatNumber>
                </Stat>
                <Stat size="sm">
                  <StatLabel color="umc.grijs2">Certainty:</StatLabel>
                  <StatNumber color="umc.grijs2">
                    {certaintyScoreToText(globalCertainty)}
                  </StatNumber>
                </Stat>
              </Box>
              <Box w="100%" p={3} borderWidth={1} borderRadius={5}>
                <HStack spacing={1}>
                  <Tooltip label="How often do similar findings occur in patient reports similar to this one?">
                    <span>
                      <FaQuestionCircle color={theme.colors.umc.donkerblauw} />
                    </span>
                  </Tooltip>
                  <Text fontWeight="bold">Local:</Text>
                </HStack>
                <Stat>
                  <StatNumber fontSize="3xl">
                    {prevalenceScoreToText(localPrevalence)}
                  </StatNumber>
                </Stat>
                <Stat size="sm">
                  <StatLabel color="umc.grijs2">Certainty:</StatLabel>
                  <StatNumber color="umc.grijs2">
                    {certaintyScoreToText(localCertainty)}
                  </StatNumber>
                </Stat>
              </Box>
            </HStack>
          </>
        );
      }
    }
  }

  return <Box {...props}>{content()}</Box>;
}
