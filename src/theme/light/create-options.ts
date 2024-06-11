import type { ThemeOptions } from "@mui/material/styles/createTheme";

import type { ColorPreset } from "..";
import { createComponents } from "./create-components";
import { createPalette } from "./create-palette";
import { createShadows } from "./create-shadows";

interface Config {
  colorPreset?: ColorPreset;
}

export const createOptions = ({ colorPreset }: Config): ThemeOptions => {
  const palette = createPalette({ colorPreset });
  const components = createComponents({ palette });
  const shadows = createShadows();

  return {
    components,
    palette,
    shadows,
  };
};
