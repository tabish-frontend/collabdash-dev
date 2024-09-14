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
import { useRouter } from "next/router";
import { Plus } from "mdi-material-ui";
import {
  BoardCard,
  ConfirmationModal,
  WorkspaceModal,
} from "src/components/shared";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { WorkSpace } from "src/types";
import { ROLES } from "src/constants/roles";
import { AuthContextType } from "src/contexts/auth";
import { useEffect } from "react";
import { workSpaceInitialValues } from "src/formik";
import { WorkspaceCard } from "./workspace-card";

// interface BoardDialogData {
//   type: string;
//   values?: object;
// }

// interface DeleeBoardDialogData {
//   id: string;
// }

interface WorkSpaceDialogData {
  type: string;
  values?: WorkSpace;
}

interface DeletWorkSpaceDialogData {
  _id?: string;
  name: string;
}

const KanbanComponent = () => {
  const { user } = useAuth<AuthContextType>();
  const settings = useSettings();
  const router = useRouter();
  const theme = useTheme();

  const { WorkSpaces } = useWorkSpace();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const WorkSpaceDialog = useDialog<WorkSpaceDialogData>();
  const DeleteWorkSpaceDialog = useDialog<DeletWorkSpaceDialogData>();
  //   const { workspace_slug } = router.query;

  const { handleDeleteWorkSpace } = useWorkSpace();

  const deleteWorkSpace = async () => {
    if (!DeleteWorkSpaceDialog.data?._id) return null;

    await handleDeleteWorkSpace(DeleteWorkSpaceDialog.data._id);
    DeleteWorkSpaceDialog.handleClose();
  };

  //   const workSpace: WorkSpace = getCurrentWorkSpace(workspace_slug);

  //   const boardDialog = useDialog<BoardDialogData>();
  //   const DeleteBoardDialog = useDialog<DeleeBoardDialogData>();

  //   const addAndUpdateBoard = async (values: any) => {
  //     const { _id, ...boardValues } = values;
  //     if (boardDialog.data?.type === "update") {
  //       handleUpdateBoard(_id, boardValues);
  //     } else {
  //       handleAddBoard({
  //         ...values,
  //         workspace: workSpace!._id,
  //       });
  //     }
  //     boardDialog.handleClose();
  //   };

  //   const deleteBoard = async (_id: string | undefined) => {
  //     if (!_id) return null;
  //     handleDeletBoard(_id);
  //     DeleteBoardDialog.handleClose();
  //   };

  useEffect(() => {
    console.log("All Workspaces", WorkSpaces);
  }, [WorkSpaces]);

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
            xs: 3,
            lg: 4,
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h5">Workspaces</Typography>

            {user?.role !== ROLES.Employee && (
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

          <Grid container spacing={2}>
            {WorkSpaces.map((workspace: any) => {
              return (
                <Grid item xs={12} xl={3} lg={4} md={6} key={workspace.slug}>
                  <WorkspaceCard
                    workspace={workspace}
                    isAccess={user?.role !== ROLES.Employee}
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
            })}
          </Grid>
        </Stack>
      </Container>

      {/* {boardDialog.open && (
        <BoardsModal
          modalType={boardDialog.data?.type}
          modal={boardDialog.open}
          members={workSpace!.members}
          modalValues={boardDialog.data?.values}
          onConfirm={addAndUpdateBoard}
          onCancel={boardDialog.handleClose}
        />
      )} */}
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
            // text: `Are you sure you want to delete ${selectedWorkspace?.title} workspace? `,
            text: `Are you sure you want to delete ${DeleteWorkSpaceDialog.data?.name} workspace? `,
          }}
        />
      )}

      {/* {DeleteBoardDialog.open && (
        <ConfirmationModal
          modal={DeleteBoardDialog.open}
          onCancel={DeleteBoardDialog.handleClose}
          onConfirm={() => deleteBoard(DeleteBoardDialog.data?.id)}
          content={{
            type: "Delete",
            text: "Are you sure you want to delete that Board ?",
          }}
        />
      )} */}
    </Box>
  );
};

const KanbanScreen: NextPage = () => {
  return <KanbanComponent />;
};

KanbanScreen.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { KanbanScreen };
