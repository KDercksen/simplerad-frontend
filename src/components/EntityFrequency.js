import {
  Box,
  Stat,
  StatLabel,
  StatHelpText,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "./SettingsForm";
import axios from "axios";

export default function EntityFrequency({ selectedEntity, ...props }) {
  const { settings } = useContext(SettingsContext);
  const [frequency, setFrequency] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function searchEntity(term) {
      setLoading(true);
      axios
        .post(process.env.REACT_APP_FREQUENCY_ENDPOINT, [
          { text: term, model_name: settings.frequency.engine },
        ])
        .then((r) => {
          setFrequency(r.data[0].frequency);
          setLoading(false);
        })
        .catch((e) => {
          setFrequency(null);
          setLoading(false);
          console.log(e);
        });
    }
    if (!(selectedEntity === null || selectedEntity === "")) {
      searchEntity(selectedEntity);
    }
  }, [selectedEntity, settings.frequency.engine]);

  function content() {
    if (loading) {
      return <Text color="gray.500">Loading...</Text>;
    }
    if (selectedEntity === null || selectedEntity === "") {
      return (
        <Text color="gray.500">
          Select an entity to see frequency information...
        </Text>
      );
    } else if (frequency === null) {
      return (
        <Text color="gray.500">
          No frequency information available for this entity
        </Text>
      );
    } else {
      return (
        <Stat>
          <StatLabel>Frequency</StatLabel>
          <StatNumber>{frequency.toFixed(2)}%</StatNumber>
          <StatHelpText>of all radiology reports</StatHelpText>
        </Stat>
      );
    }
  }

  return <Box {...props}>{content()}</Box>;
}
