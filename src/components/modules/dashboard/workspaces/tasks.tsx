import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAuth, useSettings } from "src/hooks";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts";
import { useRouter } from "next/router";
import { Plus } from "mdi-material-ui";
import { useState } from "react";
import BoardCard from "src/components/shared/cards/boardCard";
import { BoardsModal } from "src/components/shared/modals/boards-modal";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";

// Helper function to format the slug
const formatSlug = (slug: string | string[] | undefined): string => {
  if (typeof slug === "string") {
    return slug.split("_").join(" ");
  }
  return "";
};

const TaskComponent = () => {
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

  // const handleGetBoards = () => {
  //   // Board API will call here
  //   const updatedBoards = WorkSpaceBoards.filter(
  //     (board) => board.workspace === workspace_slug
  //   );

  //   setBoards(updatedBoards);
  // };

  // useEffect(() => {
  //   handleGetBoards();
  // }, [workspace_slug]);

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
          {/* <Typography variant="h4" textTransform={"capitalize"}>
            {formatSlug(workspace_slug)}
          </Typography> */}

          <Stack
            direction={"row"}
            justifyContent="space-between"
            flexWrap={"wrap"}
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
              <Typography variant="h4">{"Tasks"}</Typography>
            </Box>

            <Button
              variant="contained"
              size={isSmallScreen ? "small" : "medium"}
              //   onClick={() => router.push(`${router.pathname}/new`)}
              startIcon={
                <SvgIcon>
                  <Plus />
                </SvgIcon>
              }
            >
              Add Task
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

const Tasks: NextPage = () => {
  return <TaskComponent />;
};

Tasks.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { Tasks };
