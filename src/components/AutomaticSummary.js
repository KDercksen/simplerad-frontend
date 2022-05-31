import { Badge, Box, Skeleton, Text } from "@chakra-ui/react";

export default function AutomaticSummary(props) {
  return (
    <Box {...props}>
      <Box>
        <Badge colorScheme="purple">automated</Badge>
        <Text fontWeight="semibold" fontSize="md">
          Summary:
        </Text>
      </Box>
      <Skeleton mt={3} height="50px" />
    </Box>
  );
}
