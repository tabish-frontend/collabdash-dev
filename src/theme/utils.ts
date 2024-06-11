import type { PaletteColor } from "@mui/material/styles/createPalette";

import type { ColorPreset } from ".";
import { blue } from "./colors";

export const getPrimary = (preset?: ColorPreset): PaletteColor => {
  return blue;
};
