import { Button, Spacer, VStack } from "@chakra-ui/react";
import { FaCog, FaHome, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <VStack h="100%">
      <Button
        leftIcon={<FaHome />}
        fontWeight="bold"
        fontSize="2xl"
        variant="solid"
        as={Link}
        to="/"
      >
        <h2>simplerad</h2>
      </Button>
      <Button
        w="full"
        leftIcon={<FaSearch />}
        variant="outline"
        as={Link}
        to="/search"
      >
        Search
      </Button>
    </VStack>
  );
}
