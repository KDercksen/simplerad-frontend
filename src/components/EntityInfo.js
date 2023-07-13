import {
  Box,
  CircularProgress,
  Heading,
  Text,
  Tag,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";

function Entity({ score, entity, ...props }) {
  const linkColor = "umc.grijs2";
  return (
    <Box {...props}>
      <Heading color="umc.grijs1" fontWeight="bold" size="md">
        {entity.title}
      </Heading>
      <Text color="umc.grijs1" size="sm">
        {entity.description}
      </Text>
      {entity.url === "" ? (
        ""
      ) : (
        <Link color={linkColor} href={entity.url} isExternal>
          More information
          <ExternalLinkIcon ml={1} mr={3} />
        </Link>
      )}
      <Tag variant="subtle" bg="umc.lichtblauw" color="white" mr={3}>
        {entity.source}: {entity.source_id}
      </Tag>
      <Tag variant="subtle" bg="umc.lichtblauw" color="white">
        Score: {score.toFixed(2)}
      </Tag>
    </Box>
  );
}

export default function EntityInfo({ selectedEntity, ...props }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    function searchEntity(term) {
      setLoading(true);
      axios
        .post(process.env.REACT_APP_SEARCH_ENDPOINT, [
          {
            text: term,
          },
        ])
        .then((r) => {
          setResults(r.data[0].data);
          setLoading(false);
        })
        .catch((e) => {
          setResults([]);
          console.log(e);
          setLoading(false);
        });
    }

    if (!(selectedEntity === null || selectedEntity === "")) {
      searchEntity(selectedEntity);
    }
  }, [selectedEntity]);

  function content() {
    if (loading) {
      return <CircularProgress isIndeterminate />;
    } else if (selectedEntity === "" || selectedEntity === null) {
      return (
        <Text color="umc.grijs2">
          Select an entity to view more information...
        </Text>
      );
    } else if (selectedEntity !== "" && results.length === 0) {
      return (
        <Text color="umc.grijs2">No results found for {selectedEntity}.</Text>
      );
    } else {
      return results.map((x, i) => {
        return (
          <Entity
            bg="umc.grijs4"
            borderRadius={5}
            mb={3}
            px={2}
            py={1}
            key={i}
            {...x}
          />
        );
      });
    }
  }

  return <Box {...props}>{content()}</Box>;
}
