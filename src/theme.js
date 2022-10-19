import { extendTheme } from "@chakra-ui/react";

const Button = {
  variants: {
    solid: {
      bg: "umc.lichtblauw",
      color: "white",
      _hover: { bg: "umc.donkerblauw" },
    },
    outline: {
      bg: "umc.grijs4",
      borderColor: "umc.grijs3",
      borderWidth: "1px",
      _hover: { bg: "umc.grijs3" },
    },
    ghost: {
      bg: "umc.grijs4",
      borderWidth: 0,
      _hover: { bg: "umc.grijs3" },
    },
  },
};

export const theme = extendTheme({
  colors: {
    umc: {
      lichtblauw: "#00afdc",
      donkerblauw: "#006991",
      grijs1: "#464646",
      grijs2: "#969696",
      grijs3: "#DCDCDC",
      grijs4: "#F5F5F5",
    },
  },
  styles: {
    global: {
      "html, body": {
        bg: "white",
        color: "umc.grijs1",
      },
    },
  },
  components: { Button },
});
