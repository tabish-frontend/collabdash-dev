// ** MUI Imports
import { PaletteMode, SvgIcon } from "@mui/material";
import IconButton from "@mui/material/IconButton";

// ** Icons Imports
import WeatherNight from "mdi-material-ui/WeatherNight";
import WeatherSunny from "mdi-material-ui/WeatherSunny";

// ** Type Import

interface Props {
  onChange?: (value: PaletteMode) => void;
  value?: PaletteMode;
}

export const ModeToggler = (props: Props) => {
  // ** Props
  const { onChange, value } = props;

  const handleModeToggle = () => {
    if (value === "light") {
      onChange?.("dark");
    } else {
      onChange?.("light");
    }
  };

  return (
    <IconButton
      color="inherit"
      aria-haspopup="true"
      onClick={handleModeToggle}
      sx={{ m: 0, p: 0 }}
    >
      <SvgIcon>
        {value === "dark" ? <WeatherSunny /> : <WeatherNight />}
      </SvgIcon>
    </IconButton>
  );
};
