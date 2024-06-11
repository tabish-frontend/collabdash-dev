import { styled } from "@mui/material/styles";
import { Avatar, Badge } from "@mui/material";
import { ImageAvatar } from "./image-avatar";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export const OnlineBadge = ({ image, name }: any) => {
  return (
    <StyledBadge
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      overlap="circular"
      color="success"
      variant="dot"
      sx={{ zIndex: -1 }}
    >
      <ImageAvatar path={image} alt="user prfile" width={40} height={40} />
    </StyledBadge>
  );
};
