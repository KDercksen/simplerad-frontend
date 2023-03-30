import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
import sampleReports from "../assets/sample_reports.json";
import { FaChevronDown } from "react-icons/fa";

function SampleReportMenu({ setInputText, ...props }) {
  return (
    <Menu {...props}>
      <MenuButton as={Button} variant="ghost" rightIcon={<FaChevronDown />}>
        Samples
      </MenuButton>
      <MenuList>
        {sampleReports.map((s, i) => {
          return (
            <MenuItem onClick={() => setInputText(s.verslag)} key={i}>
              Sample {i + 1}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

function Entity({ children, ...props }) {
  const [hover, setHover] = useState("");
  const unselected = "umc.lichtblauw";
  const selected = "umc.donkerblauw";
  const color = "white";

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
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
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
    console.log(segments);
    return segments;
  }

  async function callApi() {
    setLoading(true);
    setTabIndex(1);
    axios
      .post(process.env.REACT_APP_ENTITIES_ENDPOINT, [{ text: inputText }])
      .then((r) => {
        onEntitySelect(null);
        setDisplayText(generateDisplayText(r.data[0]));
        setLoading(false);
        toast({
          status: "success",
          duration: 2000,
          title: "Entity linking successful.",
          description: `Request took ${r.headers["x-process-time"]}`,
          isClosable: true,
        });
      })
      .catch((r) => {
        setTabIndex(0);
        setLoading(false);
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
                <SampleReportMenu setInputText={setInputText} />
                <Textarea
                  value={inputText}
                  placeholder="..."
                  mt={5}
                  h="450px"
                  bg="umc.grijs4"
                  onChange={(e) => {
                    setInputText(e.target.value);
                  }}
                />
                <FormHelperText>
                  Enter radiology report to process.
                </FormHelperText>
              </FormControl>
              <Button
                isDisabled={inputIsError}
                variant="ghost"
                type="submit"
                mt={5}
                w="full"
              >
                Submit
              </Button>
            </form>
          </TabPanel>

          <TabPanel whiteSpace="pre-wrap">
            <Box bg="umc.grijs4" borderRadius={10} borderWidth={1} p={3}>
              {loading ? <CircularProgress isIndeterminate /> : displayText}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
