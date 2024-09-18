import {
  Box,
  Card,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { SquareEditOutline, TrashCanOutline } from "mdi-material-ui";
import { useRouter } from "next/router";
import { paths } from "src/constants/paths";
import { UserAvatarGroup } from "src/components/shared";
import { format } from "date-fns";

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

  useEffect(() => {
    console.log("Workspace", workspace);
  }, [workspace]);

  const formattedDate = format(new Date(workspace.createdAt), "dd MMM yyyy");

  return (
    <Card
      sx={{ cursor: "pointer", padding: 3 }}
      onClick={() => router.push(`${paths.workspaces}/${workspace?.slug}`)}
    >
      {/* <Box padding={3} display={"flex"} flexDirection={"column"} gap={3}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateWorkspace();
                  }}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <TrashCanOutline
                  color="error"
                  sx={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWorkspace();
                  }}
                />
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </Box> */}

      {/* Workspace Name and Metadata */}
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6" component="h2" fontWeight="bold">
          {workspace.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created on: {formattedDate}
        </Typography>
      </Box>

      {/* Members Avatars */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <UserAvatarGroup users={workspace.members} />
        {isAccess && (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit Workspace">
              <IconButton
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateWorkspace();
                }}
              >
                <SquareEditOutline />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Workspace">
              <IconButton
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteWorkspace();
                }}
              >
                <TrashCanOutline />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>

      {/* Divider Line */}
      <Divider sx={{ marginY: 2 }} />

      {/* Footer with more details */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Owner: {workspace.owner.full_name}
        </Typography>
      </Stack>
    </Card>
  );
};
