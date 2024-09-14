import { Box, Card, Stack, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { SquareEditOutline, TrashCanOutline } from "mdi-material-ui";
import { useRouter } from "next/router";
import { paths } from "src/constants/paths";
import { UserAvatarGroup } from "src/components/shared";

export const WorkspaceCard = ({
  workspace,
  handleUpdateWorkspace,
  handleDeleteWorkspace,
  isAccess,
}: {
  workspace: any;
  handleUpdateWorkspace: () => void;
  handleDeleteWorkspace: () => void;
  isAccess: boolean;
}) => {
  const router = useRouter();

  return (
    <Card
      sx={{ cursor: "pointer" }}
      onClick={() => router.push(`${paths.workspaces}/${workspace?.slug}`)}
    >
      <Box padding={3} display={"flex"} flexDirection={"column"} gap={3}>
        <Stack direction={"column"}>
          <Typography gutterBottom variant="h5" component="h1">
            {workspace.name}
          </Typography>
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <UserAvatarGroup users={workspace.members} />

          {isAccess && (
            <Stack direction={"row"} spacing={2}>
              <Tooltip title="Edit">
                <SquareEditOutline
                  color="success"
                  sx={{ cursor: "pointer" }}
                  onClick={handleUpdateWorkspace}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <TrashCanOutline
                  color="error"
                  sx={{ cursor: "pointer" }}
                  onClick={handleDeleteWorkspace}
                />
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </Box>
    </Card>
  );
};
