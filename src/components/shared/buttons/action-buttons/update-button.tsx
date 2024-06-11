import { LoadingButton } from "@mui/lab";
import { Button, Stack, Tooltip } from "@mui/material";

interface UpdateButtonProps {
  buttonText: string;
  permission_access?: boolean;
  handleSubmit: any;
  handleCancel?: any;
}
export const UpdateButton: React.FC<UpdateButtonProps> = ({
  buttonText,
  permission_access = true,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <Stack
      direction={"row"}
      justifyContent="flex-end"
      flexWrap="wrap"
      spacing={3}
      sx={{ p: 3 }}
    >
      <Button
        sx={{
          backgroundColor: (theme) => theme.palette.warning.main,
          "&:hover": {
            backgroundColor: (theme) => theme.palette.warning.dark,
          },
        }}
        onClick={handleCancel}
        variant="contained"
      >
        Cancel
      </Button>

      <Tooltip
        title={
          !permission_access
            ? "You do not have permission to perform this aciton"
            : ""
        }
      >
        <span>
          <LoadingButton
            loading={handleSubmit}
            loadingPosition="start"
            disabled={!permission_access}
            startIcon={<></>}
            type="submit"
            variant="contained"
            sx={{
              pl: handleSubmit ? "40px" : "16px",
            }}
          >
            {buttonText}
          </LoadingButton>
        </span>
      </Tooltip>
    </Stack>
  );
};
