import { Avatar, Box, Link, Stack } from "@mui/material";
import { RouterLink } from "../router-link";
import { paths } from "src/constants/paths";
import { Employee } from "src/types";

export const UsersListPopover = ({ users }: { users: Employee[] }) => (
  <Box p={1}>
    {users.map((user) => (
      <Stack key={user._id} direction="row" alignItems="center" gap={2} p={0.5}>
        <Avatar src={user.avatar || ""} alt={user.full_name} />
        <Link
          color="inherit"
          component={RouterLink}
          href={`${paths.employees}/${user.username}`}
          variant="subtitle1"
        >
          {user.full_name}
        </Link>
      </Stack>
    ))}
  </Box>
);
