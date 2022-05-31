import { Button, Spacer, VStack } from "@chakra-ui/react";
import { FaCog, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <VStack h="100%">
      <Button
        leftIcon={<FaHome />}
        fontWeight="bold"
        fontSize="2xl"
        variant="ghost"
        as={Link}
        to="/"
      >
        <h2>simplerad</h2>
      </Button>
      <Spacer />
      <Button
        w="100%"
        leftIcon={<FaCog />}
        variant="outline"
        as={Link}
        to="/settings"
      >
        Settings
      </Button>
    </VStack>
  );
}
