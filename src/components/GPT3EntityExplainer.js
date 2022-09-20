import { useContext, useState } from "react";
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
  const [cache, setCache] = useState(null);
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

  async function getExplanationsCache() {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_EXPLANATION_ENDPOINT}get/`, [
        { text: selectedEntity, model_name: settings.explanation.engine },
      ])
      .then((r) => {
        console.log(r.data[0].data);
        setCache(r.data[0].data);
        setLoading(false);
      })
      .catch((e) => {
        setCache(null);
        setLoading(false);
      });
  }

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
        getExplanationsCache();
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  function renderCache() {
    if (cache === null || cache.length === 0) {
      return (
        <Text size="sm" color="gray.400">
          No cached explanations found
        </Text>
      );
    } else {
      return cache.map((t) => {
        return (
          <Box my={2} p={1} borderWidth={1}>
            <Text size="sm" color="gray.400">
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
            <AccordionButton>
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
              >
                Generate
              </Button>
              <Button
                isLoading={loading}
                onClick={addExplanationToCache}
                w="full"
              >
                Add to cache
              </Button>
            </HStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Text mt={5} size="sm" color="gray.500">
        Cached explanations:
      </Text>
      {renderCache()}
    </Box>
  );
}
