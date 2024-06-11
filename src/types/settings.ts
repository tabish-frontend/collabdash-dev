import type { ColorPreset, PaletteMode } from "src/theme";

export type Layout = "horizontal" | "vertical";

export type NavColor = "blend-in" | "discrete" | "evident";

export interface Settings {
  colorPreset?: ColorPreset;
  paletteMode?: PaletteMode;
  responsiveFontSizes?: boolean;
  stretch?: boolean;
}
