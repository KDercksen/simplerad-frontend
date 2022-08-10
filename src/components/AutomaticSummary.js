import { Box, CircularProgress, Text, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "./SettingsForm";
import axios from "axios";

export default function AutomaticSummary({ reportText, ...props }) {
  const { settings } = useContext(SettingsContext);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function callApi() {
      setLoading(true);
      axios
        .post(process.env.REACT_APP_SUMMARIZE_ENDPOINT, [
          { text: reportText, model_name: settings.summarize.engine },
        ])
        .then((r) => {
          setSummary(r.data[0].summary);
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
          setSummary("Could not summarize, API unreachable?");
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
    if (reportText !== null) {
      callApi();
    }
  }, [reportText, settings.summarize.engine, toast]);

  function content() {
    if (loading) {
      return <CircularProgress isIndeterminate />;
    } else if (reportText === null || reportText === "") {
      return (
        <Text color="gray.500">Submit a report to generate a summary...</Text>
      );
    } else {
      return <Text>{summary}</Text>;
    }
  }

  return (
    <Box {...props}>
      <Box>
        <Text fontWeight="semibold" fontSize="md">
          Summary:
        </Text>
      </Box>
      <Box mt={3}>{content()}</Box>
    </Box>
  );
}
