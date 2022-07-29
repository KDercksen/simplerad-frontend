import {
  Box,
  Heading,
  Text,
  Tag,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { SettingsContext } from "./SettingsForm";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

function Entity({ score, entity, ...props }) {
  const linkColor = useColorModeValue("gray.500", "gray.400");
  return (
    <Box {...props}>
      <Heading size="md">{entity.title}</Heading>
      <Text size="sm">{entity.description}</Text>
      {entity.url === "" ? (
        ""
      ) : (
        <Link color={linkColor} href={entity.url} isExternal>
          More information
          <ExternalLinkIcon ml={1} mr={3} />
        </Link>
      )}
      <Tag variant="subtle" colorScheme="teal" mr={3}>
        {entity.source}: {entity.source_id}
      </Tag>
      <Tag variant="subtle" colorScheme="teal">
        Score: {score.toFixed(2)}
      </Tag>
    </Box>
  );
}

export default function EntityInfo({ selectedEntity, ...props }) {
  const { settings } = useContext(SettingsContext);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    function searchEntity(term) {
      setLoading(true);
      axios
        .post(process.env.REACT_APP_SEARCH_ENDPOINT, [
          {
            text: term,
            model_name: settings.search.engine,
          },
        ])
        .then((r) => {
          setResults(r.data[0].data);
          setLoading(false);
        })
        .catch((e) => {
          setResults([]);
          setLoading(false);
          console.log(e);
        });
    }
    if (!(selectedEntity === null || selectedEntity === "")) {
      searchEntity(selectedEntity);
    }
  }, [settings.search.engine, selectedEntity]);

  function content() {
    if (loading) {
      return <Text color="gray.500">Loading...</Text>;
    } else if (selectedEntity === "" || selectedEntity === null) {
      return (
        <Text color="gray.500">
          Select an entity to view more information...
        </Text>
      );
    } else if (selectedEntity !== "" && results.length === 0) {
      return (
        <Text color="gray.500">No results found for {selectedEntity}.</Text>
      );
    } else {
      return results.map((x, i) => {
        return <Entity pb={3} key={i} {...x} />;
      });
    }
  }

  return <Box {...props}>{content()}</Box>;
}
