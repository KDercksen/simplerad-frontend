import AggregatedView from "./components/AggregatedView";
import SearchView from "./components/SearchView";
import Navigation from "./components/Navigation";
import StatusBar from "./components/StatusBar";
import { HStack, VStack } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ApiContext } from "./components/ApiHealthCheck";

export default function App() {
  const [online, setOnline] = useState(false);

  return (
    <ApiContext.Provider value={{ online, setOnline }}>
      <HStack p={5} h="100vh" spacing={5}>
        <Navigation />
        <VStack w="full" h="full">
          <StatusBar w="full" pb={5} justify="flex-end" />
          <Routes>
            <Route path="/" element={<AggregatedView />} />
            <Route path="/search" element={<SearchView />} />
            {/* <Route path="*" element={<p>There is nothing here...</p>} /> */}
          </Routes>
        </VStack>
      </HStack>
    </ApiContext.Provider>
  );
}
