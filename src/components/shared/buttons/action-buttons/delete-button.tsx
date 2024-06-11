import {
  Button,
  Card,
  CardContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";

import { ConfirmationModal } from "src/components/shared/modals";

interface DeleteButtonProps {
  isLoading: boolean;
  handleDelete: any;
  handleClick: () => void;
  setModal: (param: boolean) => void;
  modal: boolean;
  permission_access?: boolean;
  account: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  isLoading,
  handleDelete,
  handleClick,
  setModal,
  modal,
  permission_access = true,
  account,
}) => {
  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Typography variant="h6">{`Delete ${account}`}</Typography>
            </Grid>
            <Grid xs={12} md={8}>
              <Stack alignItems="flex-start" spacing={3}>
                <Typography variant="subtitle1">{`Delete this ${account.toLowerCase()} and all of the source data. This is irreversible`}</Typography>
                <Tooltip
                  title={
                    !permission_access
                      ? "You do not have permission to perform this aciton"
                      : ""
                  }
                >
                  <span>
                    <Button
                      color="error"
                      variant="outlined"
                      disabled={isLoading || !permission_access}
                      onClick={handleClick}
                    >
                      {`Delete ${account}`}
                    </Button>
                  </span>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {modal && (
        <ConfirmationModal
          warning_title={`Delete ${account}`}
          warning_text={`Are you sure you want to delete this ${account}? All of the data will be permanently removed. This action cannot be undone.`}
          button_text={"Delete"}
          modal={modal}
          onCancel={() => setModal(false)}
          onDelete={() => {
            handleDelete();
            setModal(false);
          }}
        />
      )}
    </>
  );
};
