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
  const [cache, setCache] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateExplanation() {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_EXPLANATION_ENDPOINT}/propose`, [
        { text: selectedEntity, model_name: settings.explanation.engine },
      ])
      .then((r) => {
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  async function getExplanationsCache() {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_EXPLANATION_ENDPOINT}/propose`, [
        { text: selectedEntity, model_name: settings.explanation.engine },
      ])
      .then((r) => {
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  async function addExplanationToCache() {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_EXPLANATION_ENDPOINT}/propose`, [
        { text: selectedEntity, model_name: settings.explanation.engine },
      ])
      .then((r) => {
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
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
            <Textarea />
            <HStack pt={3}>
              <Button w="full">Generate</Button>
              <Button w="full">Add to cache</Button>
            </HStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Text mt={5} size="sm" color="gray.500">
        Cached explanations:
      </Text>
      {cached.map((t) => {
        return (
          <Box my={2} p={1} borderWidth={1}>
            <Text size="sm" color="gray.400">
              {t}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
