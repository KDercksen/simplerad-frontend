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
  const [hover, setHover] = useState(false);
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
      onMouseOver={(_) => {
        setHover(true);
      }}
      onMouseOut={(_) => {
        setHover(false);
      }}
      cursor="pointer"
      {...props}
    >
      {children}
    </Text>
  );
}

function LinkedSentence({ children, ...props }) {
  const [hover, setHover] = useState(false);
  const selected = "umc.donkerblauw";
  const color = "black";

  return (
    <Text
      color={hover ? selected : color}
      as="a"
      onMouseOver={(_) => {
        setHover(true);
      }}
      onMouseOut={(_) => {
        setHover(false);
      }}
      cursor="help"
      {...props}
    >
      {children}
    </Text>
  );
}

export default function ReportEditDisplayTabs({
  onEntitySelect,
  onSentenceSelect,
  onProcessRequest,
  ...props
}) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();

  const inputIsError = inputText === "";

  function getLinkSpans(spans, sentenceSpans) {
    spans.sort((a, b) => a.start - b.start);
    sentenceSpans.sort((a, b) => a.start - b.start);
    const merged = [];

    const docLen = sentenceSpans[sentenceSpans.length - 1].end;

    // make a list of zeros of length endIdx
    // this list will indicate where entities and non-entities are
    let charTypes = new Array(docLen).fill(0);
    // set the entity spans to 1
    for (let span of spans) {
      charTypes.fill(1, span.start, span.end);
    }
    // set the end of each sentence to 2 to act as an artificial boundary
    for (let sent of sentenceSpans) {
      charTypes[sent.end] = 2;
    }

    // find the start and end of each consecutive sequence of 0s in charTypes
    let start = 0;
    let end = 0;
    let i = 0;
    let sentIdx = 0;
    while (i < charTypes.length) {
      let currentSent = sentenceSpans[sentIdx];
      if (charTypes[i] === 0) {
        start = i;
        while (i < charTypes.length && charTypes[i] === 0) {
          i++;
        }
        // artificial extra increase for newlines
        if (charTypes[i] === 2) {
          i++;
          sentIdx++;
        }
        end = i;
        if (end - start > 0) {
          // not sure if this is actually necessary
          merged.push({ start: start, end: end, link: currentSent.text });
        }
      } else {
        i++;
      }
    }

    return merged;
  }

  function generateDisplayText(responseMap) {
    const sentencized = responseMap.text;
    let matches = [...sentencized.matchAll(/^.*?$/gm)];
    let sentenceSpans = matches.map((m) => {
      return { start: m.index, end: m.index + m[0].length, text: m[0] };
    });
    // sentence spans with appropriate link values
    let linkSpans = getLinkSpans(responseMap.spans, sentenceSpans).map((s) => {
      return { ...s, text: sentencized.slice(s.start, s.end) };
    });
    let combinedSpans = [...linkSpans, ...responseMap.spans].toSorted(
      (a, b) => a.start - b.start
    );
    let segments = [];
    for (let span of combinedSpans) {
      if ("link" in span) {
        segments.push(
          <LinkedSentence
            onClick={(_) => {
              onSentenceSelect(span.link);
            }}
            key={span.start.toString()}
          >
            {span.text}
          </LinkedSentence>
        );
      } else {
        segments.push(
          <Entity
            onClick={(_) => {
              onEntitySelect(span.text);
            }}
            key={span.start.toString()}
          >
            {span.text}
          </Entity>
        );
      }
    }
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
