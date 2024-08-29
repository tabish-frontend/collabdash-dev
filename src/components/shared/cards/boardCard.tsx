import { Box, Card, Stack, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { UserAvatarGroup } from "../users-avatar-group";
import { SquareEditOutline, TrashCanOutline } from "mdi-material-ui";
import { useRouter } from "next/router";
import { paths } from "src/constants/paths";

export const BoardCard = ({
  board,
  handleUpdateBoard,
  handleDeleteBoard,
  isAccess,
}: {
  board: any;
  handleUpdateBoard: () => void;
  handleDeleteBoard: () => void;
  isAccess: boolean;
}) => {
  const router = useRouter();
  const { workspace_slug } = router.query;

  return (
    <Card sx={{ cursor: "pointer" }}>
      <Box padding={3} sx={{ minHeight: "280px" }}>
        <Stack
          direction={"column"}
          onClick={() =>
            router.push(
              `${paths.workspaces}/${workspace_slug}/boards/${board?.slug}`
            )
          }
        >
          <Typography gutterBottom variant="h5" component="h1">
            {board.name}
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
          <UserAvatarGroup users={board.members} />

          {isAccess && (
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
                  onClick={handleDeleteBoard}
                />
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </Box>
    </Card>
  );
};
