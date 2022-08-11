import { Box, Divider, Heading, Input, Select, VStack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

// sensible defaults
export const defaultSettings = {
  entities: { engine: "simstring" },
  summarize: { engine: "transformer_abstractive", prompt: "" },
  search: { engine: "simstring" },
  frequency: { engine: "simstring" },
};

export const SettingsContext = React.createContext({
  settings: defaultSettings,
  setSettings: () => {},
});

export default function SettingsForm(props) {
  const { settings, setSettings } = useContext(SettingsContext);
  const [settingsConfig, setSettingsConfig] = useState(null);

  console.log(settings);

  useEffect(() => {
    if (settingsConfig === null) {
      axios
        .get(process.env.REACT_APP_SETTINGS_ENDPOINT)
        .then((r) => {
          setSettingsConfig(r.data);
        })
        .catch((e) => {
          setSettings({});
          console.log(e);
        });
    }
  }); // only run once on startup

  return (
    <Box
      w="full"
      h="full"
      align="flex-start"
      borderWidth={3}
      borderRadius={10}
      p={5}
      {...props}
    >
      <Heading as="h2" size="2xl">
        Settings
      </Heading>
      <Divider my={4} />
      {settingsConfig === null ? (
        <Heading as="h2" size="lg">
          Could not get settings
        </Heading>
      ) : (
        <>
          <Heading as="h2" fontWeight="normal" size="md">
            Entities
          </Heading>
          <Box
            display="inline-flex"
            p={3}
            mt={4}
            borderWidth={1}
            borderRadius={10}
          >
            <Select
              defaultValue={settings.entities.engine}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  entities: { engine: e.target.value },
                });
              }}
            >
              {settingsConfig.entities.engine.values.map((x, i) => {
                return (
                  <option key={i} value={x}>
                    {x}
                  </option>
                );
              })}
            </Select>
          </Box>
          <Heading mt={4} as="h2" fontWeight="normal" size="md">
            Search
          </Heading>
          <Box
            display="inline-flex"
            p={3}
            mt={4}
            borderWidth={1}
            borderRadius={10}
          >
            <Select
              defaultValue={settings.search.engine}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  search: { engine: e.target.value },
                });
              }}
            >
              {settingsConfig.search.engine.values.map((x, i) => {
                return (
                  <option key={i} value={x}>
                    {x}
                  </option>
                );
              })}
            </Select>
          </Box>
          <Heading mt={4} as="h2" fontWeight="normal" size="md">
            Summarization
          </Heading>
          <Box
            display="inline-flex"
            p={3}
            mt={4}
            borderWidth={1}
            borderRadius={10}
          >
            <VStack>
              <Select
                defaultValue={settings.summarize.engine}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    summarize: { engine: e.target.value },
                  });
                }}
              >
                {settingsConfig.summarize.engine.values.map((x, i) => {
                  return (
                    <option key={i} value={x}>
                      {x}
                    </option>
                  );
                })}
              </Select>
              <Input
                type="text"
                placeholder="prompt..."
                defaultValue={settings.summarize.prompt}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    summarize: { prompt: e.target.value },
                  });
                }}
              />
            </VStack>
          </Box>
          <Heading mt={4} as="h2" fontWeight="normal" size="md">
            Frequency
          </Heading>
          <Box
            display="inline-flex"
            p={3}
            mt={4}
            borderWidth={1}
            borderRadius={10}
          >
            <VStack>
              <Select
                defaultValue={settings.frequency.engine}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    frequency: { engine: e.target.value },
                  });
                }}
              >
                {settingsConfig.frequency.engine.values.map((x, i) => {
                  return (
                    <option key={i} value={x}>
                      {x}
                    </option>
                  );
                })}
              </Select>
            </VStack>
          </Box>
        </>
      )}
    </Box>
  );
}
