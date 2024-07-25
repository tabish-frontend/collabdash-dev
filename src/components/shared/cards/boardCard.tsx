import { Box, Card, Stack, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { UserAvatarGroup } from "../users-avatar-group";
import { SquareEditOutline, TrashCanOutline } from "mdi-material-ui";
import { ConfirmationModal } from "../modals";
import { useRouter } from "next/router";
import { paths } from "src/constants/paths";

const BoardCard = ({
  board,
  handleUpdateBoard,
}: {
  board: any;
  handleUpdateBoard: any;
}) => {
  const [deleteModal, setDeleteModal] = useState({
    open: false,

    // boardID: "",
  });

  const router = useRouter();
  const { workspace_slug } = router.query;
  return (
    <Card sx={{ cursor: "pointer" }}>
      <Box padding={3} sx={{ minHeight: "280px" }}>
        <Stack
          direction={"column"}
          onClick={
            () => router.push(paths.tasks)
            // router.push(
            //   `${paths.workspaces}/${workspace_slug}/boards/${board?.slug}`
            // )
          }
        >
          <Typography gutterBottom variant="h5" component="h1">
            {board.title}
          </Typography>

          <Typography minHeight={150} fontSize={14} pt={2}>
            {board.description ||
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam quis minima perferendis odio rerum eveniet iure"}
          </Typography>
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <UserAvatarGroup users={board.users} />

          <Stack direction={"row"} spacing={2}>
            <Tooltip title="Edit">
              <SquareEditOutline
                color="success"
                sx={{ cursor: "pointer" }}
                onClick={handleUpdateBoard}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <TrashCanOutline
                color="error"
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  setDeleteModal({
                    open: true,
                  })
                }
              />
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {deleteModal && (
        <ConfirmationModal
          warning_title={"Delete"}
          warning_text={"Are you sure you want to delete the Board ?"}
          button_text={"Delete"}
          modal={deleteModal.open}
          onCancel={() =>
            setDeleteModal({
              open: false,
              //   boardID: "",
            })
          }
          onConfirm={async () => {
            // deleteHoliday(deleteModal.holidayID);
            setDeleteModal({
              open: false,
              //   boardID: "",
            });
          }}
        />
      )}
    </Card>
  );
};

export default BoardCard;
