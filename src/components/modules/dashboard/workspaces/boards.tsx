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
import { useSettings } from "src/hooks";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts";
import { useRouter } from "next/router";
import { Plus } from "mdi-material-ui";
import { useEffect, useState } from "react";
import { WorkSpaceBoards } from "src/constants/dummyJson";
import BoardCard from "src/components/shared/cards/boardCard";
import { BoardsModal } from "src/components/shared/modals/boards-modal";

// Helper function to format the slug
const formatSlug = (slug: string | string[] | undefined): string => {
  if (typeof slug === "string") {
    return slug.split("_").join(" ");
  }
  return "";
};

const BoardsComponent = () => {
  const settings = useSettings();
  const router = useRouter();
  const theme = useTheme();
  const [boards, setBoards] = useState<any[]>([]);

  const [boardModal, setBoardModal] = useState({
    open: false,
    type: "",
    values: {},
  });

  const { workspace_slug } = router.query;

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleGetBoards = () => {
    // Board API will call here
    const updatedBoards = WorkSpaceBoards.filter(
      (board) => board.workspace === workspace_slug
    );

    setBoards(updatedBoards);
  };

  useEffect(() => {
    handleGetBoards();
  }, [workspace_slug]);

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
          <Typography variant="h4" textTransform={"capitalize"}>
            {formatSlug(workspace_slug)}
          </Typography>

          <Stack
            direction={"row"}
            justifyContent="space-between"
            flexWrap={"wrap"}
          >
            <Typography variant="h5">Boards</Typography>

            <Button
              variant="contained"
              size={isSmallScreen ? "small" : "medium"}
              //   onClick={() => router.push(`${router.pathname}/new`)}
              startIcon={
                <SvgIcon>
                  <Plus />
                </SvgIcon>
              }
              onClick={() => {
                setBoardModal({
                  open: true,
                  type: "create",
                  values: {},
                });
              }}
            >
              Add Board
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {boards.map((board: any) => {
              return (
                <Grid item xs={12} xl={3} lg={4} md={6} key={board.slug}>
                  <BoardCard
                    board={board}
                    handleUpdateBoard={() =>
                      setBoardModal({
                        open: true,
                        type: "update",
                        values: board,
                      })
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Container>

      {boardModal.open && (
        <BoardsModal
          modalType={boardModal.type}
          modal={boardModal.open}
          modalValues={boardModal.values}
          onCancel={() => {
            setBoardModal({
              open: false,
              type: "",
              values: {},
            });
          }}
          // onConfirm={addAndUpdateHoliday}
        />
      )}
    </Box>
  );
};

const Boards: NextPage = () => {
  return <BoardsComponent />;
};

Boards.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { Boards };
