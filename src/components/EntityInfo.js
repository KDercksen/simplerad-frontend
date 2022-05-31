import { Box, Skeleton } from "@chakra-ui/react";

export default function EntityInfo(props) {
  return (
    <Box {...props}>
      <Skeleton height="100px" />
    </Box>
  );
}
