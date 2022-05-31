import AggregatedView from "./components/AggregatedView";
import Navigation from "./components/Navigation";
import StatusBar from "./components/StatusBar";
import SettingsForm from "./components/SettingsForm";
import { HStack, VStack } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <HStack p={5} h="100vh" spacing={5}>
      <Navigation />
      <VStack w="full" h="full">
        <StatusBar w="full" justify="flex-end" />
        <Routes>
          <Route path="/" element={<AggregatedView />} />
          <Route path="/settings" element={<SettingsForm />} />
        </Routes>
      </VStack>
    </HStack>
  );
}
