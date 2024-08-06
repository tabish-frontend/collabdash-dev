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
import { useDialog, useSettings } from "src/hooks";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts";
import { useRouter } from "next/router";
import { Plus } from "mdi-material-ui";
import {
  BoardCard,
  BoardsModal,
  ConfirmationModal,
} from "src/components/shared";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { WorkSpace } from "src/types";

interface BoardDialogData {
  type: string;
  values?: object;
}

interface DeleeBoardDialogData {
  id: string;
}

const WorkSpacesComponent = () => {
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
      handleUpdateBoard(_id, boardValues);
    } else {
      handleAddBoard({
        ...values,
        workspace: workSpace!._id,
      });
    }
    boardDialog.handleClose();
  };

  const deleteBoard = async (_id: string | undefined) => {
    if (!_id) return null;
    handleDeletBoard(_id);
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
          <Typography variant="h5">Boards</Typography>

          <Stack
            direction={"row"}
            justifyContent="space-between"
            flexWrap={"wrap"}
          >
            <Typography variant="h6">{workSpace?.name}</Typography>

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
          </Stack>

          <Grid container spacing={2}>
            {workSpace?.boards?.map((board: any) => {
              return (
                <Grid item xs={12} xl={3} lg={4} md={6} key={board.slug}>
                  <BoardCard
                    board={board}
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
