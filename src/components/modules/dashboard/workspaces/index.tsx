import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAuth, useDialog, useSettings } from "src/hooks";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts";
import { Plus } from "mdi-material-ui";
import { ConfirmationModal, NoRecordFound } from "src/components/shared";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { WorkSpace } from "src/types";
import { ROLES } from "src/constants/roles";
import { AuthContextType } from "src/contexts/auth";
import { workSpaceInitialValues } from "src/formik";
import { WorkspaceCard } from "./workspace-card";
import { WorkspaceModal } from "./workspace-modal";

interface WorkSpaceDialogData {
  type: string;
  values?: WorkSpace;
}

interface DeletWorkSpaceDialogData {
  _id?: string;
  name: string;
}

const WorkSpacesComponent = () => {
  const { user } = useAuth<AuthContextType>();

  const isEmployee = user?.role === ROLES.Employee;
  const settings = useSettings();
  const theme = useTheme();

  const { WorkSpaces } = useWorkSpace();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const WorkSpaceDialog = useDialog<WorkSpaceDialogData>();
  const DeleteWorkSpaceDialog = useDialog<DeletWorkSpaceDialogData>();

  const { handleDeleteWorkSpace } = useWorkSpace();

  const deleteWorkSpace = async () => {
    if (!DeleteWorkSpaceDialog.data?._id) return null;

    await handleDeleteWorkSpace(DeleteWorkSpaceDialog.data._id);
    DeleteWorkSpaceDialog.handleClose();
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 4,
      }}
    >
      <Container maxWidth={settings.stretch ? false : "xl"}>
        <Stack
          spacing={{
            xs: 2,
            lg: 1,
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{ px: 2 }}
          >
            <Typography variant="h4">Workspaces</Typography>

            {!isEmployee && (
              <Button
                variant="contained"
                size={isSmallScreen ? "small" : "medium"}
                startIcon={
                  <SvgIcon>
                    <Plus />
                  </SvgIcon>
                }
                onClick={() => {
                  WorkSpaceDialog.handleOpen({
                    type: "Create",
                  });
                }}
              >
                Add Workspace
              </Button>
            )}
          </Stack>

          <Grid container spacing={2} sx={{ pr: 3 }} minHeight={"70vh"}>
            {WorkSpaces.length === 0 ? (
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
              >
                <NoRecordFound />
              </Stack>
            ) : (
              WorkSpaces.map((workspace: any) => {
                return (
                  <Grid item xs={12} xl={3} lg={4} md={6} key={workspace.slug}>
                    <WorkspaceCard
                      workspace={workspace}
                      handleUpdateWorkspace={() => {
                        WorkSpaceDialog.handleOpen({
                          type: "Update",
                          values: workspace,
                        });
                      }}
                      handleDeleteWorkspace={() =>
                        DeleteWorkSpaceDialog.handleOpen({
                          _id: workspace._id,
                          name: workspace.name,
                        })
                      }
                    />
                  </Grid>
                );
              })
            )}
          </Grid>
        </Stack>
      </Container>

      {WorkSpaceDialog.open && (
        <WorkspaceModal
          modal={WorkSpaceDialog.open}
          madal_type={WorkSpaceDialog.data?.type}
          workSpaceValues={
            WorkSpaceDialog.data?.values || workSpaceInitialValues
          }
          onCancel={() => {
            WorkSpaceDialog.handleClose();
          }}
        />
      )}

      {DeleteWorkSpaceDialog.open && (
        <ConfirmationModal
          modal={DeleteWorkSpaceDialog.open}
          onConfirm={deleteWorkSpace}
          onCancel={DeleteWorkSpaceDialog.handleClose}
          content={{
            type: "Delete Workspace",
            text: `Are you sure you want to delete that workspace? `,
          }}
        />
      )}
    </Box>
  );
};

const WorkSpaces: NextPage = () => {
  return <WorkSpacesComponent />;
};

WorkSpaces.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { WorkSpaces };
