import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Textarea,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function ReportEditDisplayTabs(props) {
  const [inputText, setInputText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();

  const inputIsError = inputText === "";

  function generateDisplay(e) {
    e.preventDefault();
    async function callApi() {
      axios
        .post(process.env.REACT_APP_ENTITIES_ENDPOINT, [{ text: inputText }])
        .then((r) => {
          setDisplayText(JSON.stringify(r.data, null, 2));
          setTabIndex(1);
          toast({
            status: "success",
            duration: 2000,
            title: "Processing successful.",
          });
        })
        .catch((r) => {
          toast({
            status: "error",
            duration: 5000,
            title: "Unable to process.",
            description: r.toString(),
          });
        });
    }
    callApi();
  }

  return (
    <Box {...props}>
      <Tabs
        defaultIndex={0}
        index={tabIndex}
        onChange={(index) => setTabIndex(index)}
      >
        <TabList>
          <Tab>Edit</Tab>
          <Tab>Display</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <form onSubmit={generateDisplay}>
              <FormControl isInvalid={inputIsError}>
                <Textarea
                  value={inputText}
                  placeholder="..."
                  h="300px"
                  onChange={(e) => setInputText(e.target.value)}
                />
                <FormHelperText>
                  Enter radiology report to process.
                </FormHelperText>
              </FormControl>
              <Button isDisabled={inputIsError} type="submit" mt={5} w="full">
                Submit
              </Button>
            </form>
          </TabPanel>

          <TabPanel>
            <Text as="pre">{displayText}</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
