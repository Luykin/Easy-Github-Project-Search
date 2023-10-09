import { presetIcons, presetUno, presetWebFonts } from "unocss";

export default {
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      provider: "google",
      fonts: {
        roboto_condensed: {
          name: "Roboto Condensed",
          weights: ["700"],
        },
        cabin: {
          name: "Cabin",
          weights: ["600"],
        },
      },
    }),
  ],
};
