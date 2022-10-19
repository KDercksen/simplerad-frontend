import AggregatedView from "./components/AggregatedView";
import SearchView from "./components/SearchView";
import Navigation from "./components/Navigation";
import StatusBar from "./components/StatusBar";
import SettingsForm from "./components/SettingsForm";
import { HStack, VStack } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ApiContext } from "./components/ApiHealthCheck";
import { defaultSettings, SettingsContext } from "./components/SettingsForm";

export default function App() {
  const [online, setOnline] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <ApiContext.Provider value={{ online, setOnline }}>
      <SettingsContext.Provider value={{ settings, setSettings }}>
        <HStack p={5} h="100vh" spacing={5}>
          <Navigation />
          <VStack w="full" h="full">
            <StatusBar w="full" pb={5} justify="flex-end" />
            <Routes>
              <Route path="/" element={<AggregatedView />} />
              <Route path="/settings" element={<SettingsForm />} />
              <Route path="/search" element={<SearchView />} />
              {/* <Route path="*" element={<p>There is nothing here...</p>} /> */}
            </Routes>
          </VStack>
        </HStack>
      </SettingsContext.Provider>
    </ApiContext.Provider>
  );
}
