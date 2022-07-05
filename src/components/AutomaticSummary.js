import { Badge, Box, SkeletonText, Text, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "./SettingsForm";
import axios from "axios";

export default function AutomaticSummary(props) {
  const { settings } = useContext(SettingsContext);
  const [summaries, setSummaries] = useState([""]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function callApi() {
      setLoading(true);
      axios
        .post(process.env.REACT_APP_SUMMARIZE_ENDPOINT, [
          { text: props.request, model_name: settings.summarize.engine },
        ])
        .then((r) => {
          setSummaries(r.data.map((x) => x.summary));
          setLoading(false);
          toast({
            status: "success",
            title: "Summarization successful.",
            description: `Request took ${r.headers["x-process-time"]}`,
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((e) => {
          setSummaries(["Could not summarize, API unreachable?"]);
          setLoading(false);
          toast({
            status: "error",
            title: "Could not summarize.",
            description: e.toString(),
            duration: 5000,
            isClosable: true,
          });
        });
    }
    if (props.request !== null) {
      callApi();
    }
  }, [toast, settings.summarize.engine, props.request]);

  return (
    <Box {...props}>
      <Box>
        <Badge colorScheme="purple">automated</Badge>
        <Text fontWeight="semibold" fontSize="md">
          Summary:
        </Text>
      </Box>
      {loading ? (
        <SkeletonText noOfLines={5} mt={2} spacing={3} />
      ) : (
        summaries.map((x, i) => (
          <Box key={i.toString()} borderRadius={2} borderWidth={1} p={3} mt={2}>
            <Text>{x}</Text>
          </Box>
        ))
      )}
    </Box>
  );
}
