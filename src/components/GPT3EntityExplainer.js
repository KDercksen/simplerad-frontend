import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  CircularProgress,
  Heading,
  HStack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { SettingsContext } from "./SettingsForm";

export default function GPT3EntityExplainer({ selectedEntity, ...props }) {
  const { settings } = useContext(SettingsContext);
  const [proposedText, setProposedText] = useState("");
  const [cache, setCache] = useState([]);
  const [loading, setLoading] = useState(false);

  async function generateExplanation() {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_EXPLANATION_ENDPOINT}propose/`, [
        { text: selectedEntity, model_name: settings.explanation.engine },
      ])
      .then((r) => {
        setProposedText(r.data[0].data[0]);
        setLoading(false);
      })
      .catch((e) => {
        setProposedText("");
        setLoading(false);
      });
  }

  useEffect(() => {
    async function getExplanationsCache() {
      setLoading(true);
      axios
        .post(`${process.env.REACT_APP_EXPLANATION_ENDPOINT}get/`, [
          { text: selectedEntity, model_name: settings.explanation.engine },
        ])
        .then((r) => {
          setCache(r.data[0].data);
          setLoading(false);
        })
        .catch((e) => {
          setCache([]);
          setLoading(false);
        });
    }
    if (!(selectedEntity === null || selectedEntity === "")) {
      getExplanationsCache();
    }
  }, [settings.explanation.engine, selectedEntity]);

  async function addExplanationToCache() {
    setLoading(true);
    axios
      .put(`${process.env.REACT_APP_EXPLANATION_ENDPOINT}add/`, [
        {
          text: proposedText,
          model_name: settings.explanation.engine,
          term: selectedEntity,
        },
      ])
      .then((r) => {
        const tmp = [proposedText];
        setCache([...cache, ...tmp]);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  function renderCache() {
    if (loading) {
      return <CircularProgress isIndeterminate />;
    } else if (selectedEntity === null || selectedEntity === "") {
      return (
        <Text size="sm" color="umc.grijs2">
          Select an entity to view explanations...
        </Text>
      );
    } else if (cache.length === 0) {
      return (
        <Text size="sm" color="umc.grijs2">
          No cached explanations found
        </Text>
      );
    } else {
      return cache.map((t, i) => {
        return (
          <Box
            my={2}
            p={2}
            bg="umc.grijs4"
            key={i}
            borderRadius={2}
            borderWidth={1}
          >
            <Text size="sm" color="umc.grijs1">
              {t}
            </Text>
          </Box>
        );
      });
    }
  }

  return (
    <Box {...props}>
      <Heading mb={5} size="md">
        {selectedEntity}
      </Heading>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton bg="umc.grijs4">
              <Box w="full">Click to generate new explanation</Box>
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <Textarea
              value={proposedText}
              disabled={
                selectedEntity === null || selectedEntity === "" || loading
              }
              onChange={(e) => {
                setProposedText(e.target.value);
              }}
            />
            <HStack pt={3}>
              <Button
                isLoading={loading}
                onClick={generateExplanation}
                w="full"
                variant="solid"
              >
                Generate
              </Button>
              <Button
                isLoading={loading}
                onClick={addExplanationToCache}
                w="full"
                variant="ghost"
              >
                Add to cache
              </Button>
            </HStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Text mt={5} size="sm" color="umc.grijs2">
        Cached explanations:
      </Text>
      {renderCache()}
    </Box>
  );
}
