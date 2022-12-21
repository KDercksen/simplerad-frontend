import {
  Box,
  Switch,
  CircularProgress,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AutomaticSummary({ reportText, ...props }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function callApi() {
      setLoading(true);
      axios
        .post(process.env.REACT_APP_SUMMARIZE_ENDPOINT, [{ text: reportText }])
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
    if (reportText !== null && enabled) {
      callApi();
    }
  }, [reportText, toast, enabled]);

  function content() {
    if (!enabled) {
      return <Text color="gray.500">Summarization disabled...</Text>;
    } else if (loading) {
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
      <Switch
        onChange={(e) => {
          setEnabled(e.target.checked);
        }}
      >
        Enabled
      </Switch>
      <Box mt={3}>
        <Text fontWeight="semibold" fontSize="md">
          Summary:
        </Text>
      </Box>
      <Box mt={3}>{content()}</Box>
    </Box>
  );
}
