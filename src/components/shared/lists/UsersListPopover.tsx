import { Avatar, Box, Link, Stack } from "@mui/material";
import { RouterLink } from "../router-link";
import { paths } from "src/constants/paths";
import { Employee } from "src/types";
import { Scrollbar } from "src/utils/scrollbar";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";

export const UsersListPopover = ({ users }: { users: Employee[] }) => {
  const router = useRouter();

  const { user } = useAuth<AuthContextType>();

  const isEmployee = user?.role === ROLES.Employee;

  return (
    <Scrollbar sx={{ maxHeight: 150, width: 200, overflowY: "auto" }}>
      <Box>
        {users.map((user) => (
          <Stack
            key={user._id}
            direction="row"
            alignItems="center"
            gap={2}
            p={0.5}
          >
            <Avatar src={user.avatar || ""} alt={user.full_name} />
            <Link
              color="inherit"
              variant="subtitle1"
              onClick={(e) => {
                e.stopPropagation();
                !isEmployee &&
                  router.push(`${paths.employees}/${user.username}`);
              }}
            >
              {user.full_name}
            </Link>
          </Stack>
        ))}
      </Box>
    </Scrollbar>
  );
};
