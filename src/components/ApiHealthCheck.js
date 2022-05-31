import axios from "axios";
import { Badge } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function ApiHealthCheck(props) {
  const [online, setOnline] = useState();

  useEffect(() => {
    async function doCheck() {
      axios
        .get(process.env.REACT_APP_API_DOMAIN)
        .then((res) => {
          console.log(res);
          setOnline(true);
        })
        .catch((err) => {
          console.log(err);
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
