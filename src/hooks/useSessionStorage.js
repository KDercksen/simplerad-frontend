import { useState, useEffect } from "react";

export default function useSessionStorage(key, defaultValue) {
  const [value, setValue] = useState(
    (() => {
      const stored = sessionStorage.getItem(key);
      if (!stored) {
        return defaultValue;
      }
      return JSON.parse(stored);
    })()
  );

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
