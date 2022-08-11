import { HStack, VStack, Input } from "@chakra-ui/react";
import { useState } from "react";
import EntityInfo from "./EntityInfo";

export default function SearchView() {
  const [selectedEntity, setSelectedEntity] = useState("");
  return (
    <HStack w="full">
      <VStack w="50%">
        <Input
          placeholder="Search entity information..."
          onChange={(e) => {
            setSelectedEntity(e.target.value);
          }}
        />
        <EntityInfo
          w="full"
          h="800px"
          overflow="auto"
          borderWidth={2}
          borderRadius={10}
          p={3}
          selectedEntity={selectedEntity}
        />
      </VStack>
    </HStack>
  );
}
