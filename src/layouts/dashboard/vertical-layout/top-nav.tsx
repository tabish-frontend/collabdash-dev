import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import type { Theme } from "@mui/material/styles/createTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha } from "@mui/system/colorManipulator";
import Menu01Icon from "@untitled-ui/icons-react/build/esm/Menu01";
import { Settings } from "src/types/settings";
import PropTypes from "prop-types";
import { useCallback, type FC } from "react";
import { ModeToggler } from "src/components/shared/ModeToggler";
import { useSettings } from "src/hooks";
import { AccountButton } from "../account-button";
import { NotificationsButton } from "../notifications-button";

const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 240;

interface TopNavProps {
  onMobileNavOpen?: () => void;
}

export const TopNav: FC<TopNavProps> = (props) => {
  const { onMobileNavOpen, ...other } = props;
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const setting = useSettings();

  const handleFieldUpdate = useCallback(
    (field: keyof Settings, value: unknown): void => {
      setting.handleUpdate?.({
        [field]: value,
      });
    },
    [setting]
  );

  return (
    <Box
      component="header"
      sx={{
        backdropFilter: "blur(6px)",
        backgroundColor: (theme) =>
          alpha(theme.palette.background.default, 0.8),
        // borderBottom: "1px solid #dcdfe4",
        // borderTop: "1px solid #dcdfe4",
        boxShadow: "inherit",
        position: "sticky",
        left: {
          lg: `${SIDE_NAV_WIDTH}px`,
        },
        top: 0,
        width: {
          lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
        },
        zIndex: (theme) => theme.zIndex.appBar,
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 2,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          {!lgUp && (
            <IconButton onClick={onMobileNavOpen}>
              <SvgIcon>
                <Menu01Icon />
              </SvgIcon>
            </IconButton>
          )}
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2} px={4}>
          <ModeToggler
            value={setting.paletteMode}
            onChange={(value) => handleFieldUpdate("paletteMode", value)}
          />
          <NotificationsButton />
          <AccountButton />
        </Stack>
      </Stack>
    </Box>
  );
};

TopNav.propTypes = {
  onMobileNavOpen: PropTypes.func,
};
