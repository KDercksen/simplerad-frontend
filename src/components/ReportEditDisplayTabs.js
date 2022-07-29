import { useContext, useState } from "react";
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
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { SettingsContext } from "./SettingsForm";

function Entity({ children, ...props }) {
  const [hover, setHover] = useState("");
  const unselected = useColorModeValue("green.200", "green.800");
  const selected = useColorModeValue("green.100", "green.700");
  const color = useColorModeValue("black", "white");

  return (
    <Text
      bg={hover ? selected : unselected}
      color={color}
      padding="2px 4px"
      borderRadius={5}
      as="mark"
      onMouseOver={(e) => {
        setHover(true);
      }}
      onMouseOut={(e) => {
        setHover(false);
      }}
      cursor="pointer"
      {...props}
    >
      {children}
    </Text>
  );
}

export default function ReportEditDisplayTabs({
  onEntitySelect,
  onProcessRequest,
  ...props
}) {
  const { settings } = useContext(SettingsContext);
  const [inputText, setInputText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();

  const inputIsError = inputText === "";

  function generateDisplayText(responseMap) {
    const sentencized = responseMap.text;
    let segments = [];
    let span;
    let lastSeen = 0;
    for (span of responseMap.spans) {
      const { start, end, text } = span;
      segments.push(sentencized.slice(lastSeen, start));
      segments.push(
        <Entity
          onClick={(e) => {
            onEntitySelect(text);
          }}
          key={start.toString()}
        >
          {text}
        </Entity>
      );
      lastSeen = end;
    }
    segments.push(sentencized.slice(lastSeen));
    return segments;
  }

  async function callApi() {
    axios
      .post(process.env.REACT_APP_ENTITIES_ENDPOINT, [
        { text: inputText, model_name: settings.entities.engine },
      ])
      .then((r) => {
        onEntitySelect(null);
        setDisplayText(generateDisplayText(r.data[0]));
        setTabIndex(1);
        toast({
          status: "success",
          duration: 2000,
          title: "Entity linking successful.",
          description: `Request took ${r.headers["x-process-time"]}`,
          isClosable: true,
        });
      })
      .catch((r) => {
        toast({
          status: "error",
          duration: 5000,
          title: "Unable to link entities.",
          description: r.toString(),
          isClosable: true,
        });
      });
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
            <form
              onSubmit={(e) => {
                onProcessRequest(inputText);
                callApi();
                e.preventDefault();
              }}
            >
              <FormControl isInvalid={inputIsError}>
                <Textarea
                  value={inputText}
                  placeholder="..."
                  h="300px"
                  onChange={(e) => {
                    setInputText(e.target.value);
                  }}
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

          <TabPanel whiteSpace="pre-wrap">{displayText}</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
