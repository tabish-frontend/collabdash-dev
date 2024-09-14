import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAuth, useDialog, useSettings } from "src/hooks";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts";
import { useRouter } from "next/router";
import { Plus } from "mdi-material-ui";
import { ConfirmationModal } from "src/components/shared";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { WorkSpace } from "src/types";
import { ROLES } from "src/constants/roles";
import { AuthContextType } from "src/contexts/auth";
import { BoardsModal } from "./boards-modal";
import { BoardCard } from "./boardCard";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";

interface BoardDialogData {
  type: string;
  values?: object;
}

interface DeleeBoardDialogData {
  id: string;
}

const WorkSpacesComponent = () => {
  const { user } = useAuth<AuthContextType>();
  const settings = useSettings();
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { workspace_slug } = router.query;

  const {
    getCurrentWorkSpace,
    handleAddBoard,
    handleUpdateBoard,
    handleDeletBoard,
  } = useWorkSpace();

  const workSpace: WorkSpace = getCurrentWorkSpace(workspace_slug);

  const boardDialog = useDialog<BoardDialogData>();
  const DeleteBoardDialog = useDialog<DeleeBoardDialogData>();

  const addAndUpdateBoard = async (values: any) => {
    const { _id, ...boardValues } = values;
    if (boardDialog.data?.type === "update") {
      await handleUpdateBoard(_id, boardValues);
    } else {
      await handleAddBoard({
        ...values,
        workspace: workSpace!._id,
      });
    }
    boardDialog.handleClose();
  };

  const deleteBoard = async (_id: string | undefined) => {
    if (!_id) return null;
    await handleDeletBoard(_id);
    DeleteBoardDialog.handleClose();
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
            xs: 3,
            lg: 4,
          }}
        >
          <Box display="flex" alignItems={"center"}>
            <Tooltip title="Back">
              <Button
                onClick={() => router.back()}
                color="inherit"
                size="small"
              >
                <SvgIcon>
                  <ArrowLeftIcon />
                </SvgIcon>
              </Button>
            </Tooltip>
            <Typography variant="h5">{"Boards"}</Typography>
          </Box>

          <Stack
            direction={"row"}
            justifyContent="space-between"
            flexWrap={"wrap"}
          >
            <Typography variant="h6">{workSpace?.name}</Typography>

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
                  boardDialog.handleOpen({
                    type: "create",
                  });
                }}
              >
                Add Board
              </Button>
            )}
          </Stack>

          <Grid container spacing={2}>
            {workSpace?.boards?.map((board: any) => {
              return (
                <Grid item xs={12} xl={3} lg={4} md={6} key={board.slug}>
                  <BoardCard
                    board={board}
                    isAccess={user?.role !== ROLES.Employee}
                    handleUpdateBoard={() => {
                      boardDialog.handleOpen({
                        type: "update",
                        values: board,
                      });
                    }}
                    handleDeleteBoard={() =>
                      DeleteBoardDialog.handleOpen({
                        id: board._id,
                      })
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Container>

      {boardDialog.open && (
        <BoardsModal
          modalType={boardDialog.data?.type}
          modal={boardDialog.open}
          members={workSpace!.members}
          modalValues={boardDialog.data?.values}
          onConfirm={addAndUpdateBoard}
          onCancel={boardDialog.handleClose}
        />
      )}

      {DeleteBoardDialog.open && (
        <ConfirmationModal
          modal={DeleteBoardDialog.open}
          onCancel={DeleteBoardDialog.handleClose}
          onConfirm={() => deleteBoard(DeleteBoardDialog.data?.id)}
          content={{
            type: "Delete",
            text: "Are you sure you want to delete that Board ?",
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
