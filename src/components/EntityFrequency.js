import {
  Box,
  Button,
  CircularProgress,
  HStack,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import axios from "axios";

export default function EntityFrequency(props) {
  const [query, setQuery] = useState("");
  const [frequency, setFrequency] = useState(null);
  const [sampleSize, setSampleSize] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(term) {
    setLoading(true);
    axios
      .post(process.env.REACT_APP_FREQUENCY_ENDPOINT, [{ text: term }])
      .then((r) => {
        setFrequency(r.data[0].global_frequency);
        setSampleSize(r.data[0].global_certainty);
        setLoading(false);
      })
      .catch((e) => {
        setFrequency(null);
        setSampleSize(null);
        setLoading(false);
        console.log(e);
      });
  }

  function makeCenteredMetric(labels, colors) {
    const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
      const idx = Math.min(
        parseInt(dataWithArc[0].data.value / 25),
        labels.length - 1
      );
      return (
        <text
          x={centerX}
          y={centerY / 1.2}
          textAnchor="middle"
          dominantBaseline="text-bottom"
          style={{ fill: colors[idx], fontSize: "24px", fontWeight: 300 }}
        >
          {labels[idx]}
        </text>
      );
    };
    return CenteredMetric;
  }

  function content() {
    if (loading) {
      return <CircularProgress isIndeterminate />;
    } else if (frequency === null || sampleSize === null) {
      return (
        <Text color="umc.grijs2">
          No frequency information available for this entity.
        </Text>
      );
    } else {
      const freqdata = [
        {
          id: "% of corpus with similar observations",
          value: (frequency * 100).toFixed(0),
        },
        {
          id: "% of corpus without similar observations",
          value: ((1 - frequency) * 100).toFixed(0),
        },
      ];
      const sampledata = [
        {
          id: "estimation certainty",
          value: (sampleSize * 100).toFixed(0),
        },
        {
          id: "estimation uncertainty",
          value: ((1 - sampleSize) * 100).toFixed(0),
        },
      ];

      return (
        <>
          <ResponsivePie
            data={freqdata}
            margin={{ top: -70, bottom: 0, left: 5, right: 5 }}
            colors={{ scheme: "paired" }}
            innerRadius={0.7}
            activeOuterRadiusOffset={5}
            padAngle={0.5}
            cornerRadius={5}
            startAngle={270}
            endAngle={450}
            enableArcLinkLabels={false}
            arcLabel={(item) => {
              return item.value > 5 ? `${item.value}%` : "";
            }}
            arcLabelsTextColor="white"
            layers={[
              "arcs",
              "arcLabels",
              "arcLinkLabels",
              "legends",
              makeCenteredMetric(
                ["rare", "uncommon", "common", "very common"],
                ["red", "orange", "darkgreen", "green"]
              ),
            ]}
          />
          <ResponsivePie
            data={sampledata}
            margin={{ top: -70, bottom: 0, left: 5, right: 5 }}
            colors={{ scheme: "paired" }}
            innerRadius={0.7}
            activeOuterRadiusOffset={5}
            padAngle={0.5}
            cornerRadius={5}
            startAngle={270}
            endAngle={450}
            enableArcLinkLabels={false}
            arcLabel={(item) => {
              return item.value > 5 ? `${item.value}%` : "";
            }}
            arcLabelsTextColor="white"
            layers={[
              "arcs",
              "arcLabels",
              "arcLinkLabels",
              "legends",
              makeCenteredMetric(
                ["very uncertain", "uncertain", "certain", "very certain"],
                ["red", "orange", "darkgreen", "green"]
              ),
            ]}
          />
        </>
      );
    }
  }

  return (
    <Box {...props}>
      <Box>
        <InputGroup>
          <Input
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Observation query"
          />
          <Button
            ml={2}
            type="submit"
            onClick={() => {
              handleSearch(query);
            }}
          >
            Submit
          </Button>
        </InputGroup>
      </Box>
      <HStack align="top" px={3} mt={5} w="full" h="full">
        {content()}
      </HStack>
    </Box>
  );
}
