import type { FC } from "react";
import PropTypes from "prop-types";
import type { SxProps } from "@mui/system/styleFunctionSx";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { IconButton, SvgIcon } from "@mui/material";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import { TenantPopover } from "./tenant-popover";
import { usePopover } from "src/hooks/use-popover";
import { useDispatch } from "react-redux";

interface TenantSwitchProps {
  sx?: SxProps;
}

const tenants: string[] = ["Super-Admin", "Admin", "Teacher", "Parent"];

export const TenantSwitch: FC<TenantSwitchProps> = (props) => {
  const popover = usePopover<HTMLButtonElement>();

  const dispatch = useDispatch();

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} {...props}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="inherit" fontWeight="bold">
            Tuition Highway
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

TenantSwitch.propTypes = {
  // @ts-ignore
  sx: PropTypes.object,
};
