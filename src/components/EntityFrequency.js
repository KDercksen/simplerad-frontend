import {
  Box,
  SkeletonText,
  Stat,
  StatLabel,
  StatHelpText,
  StatNumber,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "./SettingsForm";
import axios from "axios";

export default function EntityFrequency({ selectedEntity, ...props }) {
  const { settings } = useContext(SettingsContext);
  const [frequency, setFrequency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function searchEntity(term) {
      setLoading(true);
      axios
        .post(process.env.REACT_APP_FREQUENCY_ENDPOINT, [
          { text: term, model_name: settings.frequency.engine },
        ])
        .then((r) => {
          console.log(r.data);
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

  return (
    <Box {...props}>
      {loading ? (
        <SkeletonText noOfLines={3} spacing={3} />
      ) : (
        <Stat>
          <StatLabel>Frequency</StatLabel>
          <StatNumber>{frequency.toFixed(2)}%</StatNumber>
          <StatHelpText>of all radiology reports</StatHelpText>
        </Stat>
      )}
    </Box>
  );
}
