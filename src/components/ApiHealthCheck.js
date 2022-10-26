import axios from "axios";
import { Badge } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";

export const ApiContext = React.createContext({
  online: false,
  setOnline: () => {},
});

export default function ApiHealthCheck(props) {
  const { online, setOnline } = useContext(ApiContext);

  useEffect(() => {
    async function doCheck() {
      axios
        .get(process.env.REACT_APP_API_DOMAIN)
        .then((res) => {
          setOnline(true);
        })
        .catch((err) => {
          setOnline(false);
        });
    }

    // make sure the status is rendered immediately
    doCheck();

    // as well as on interval
    const interval = setInterval(() => {
      doCheck();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <Badge
      {...props}
      colorScheme={online ? "green" : "red"}
      title={
        online
          ? "API is online and reachable"
          : "API is offline or not reachable"
      }
    >
      API
    </Badge>
  );
}
