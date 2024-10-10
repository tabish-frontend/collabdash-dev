import { styled } from "@mui/material/styles";
import { Avatar, Badge } from "@mui/material";
import { ImageAvatar } from "./image-avatar";
import Image from "next/image";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    width: 12,
    height: 12,
    borderRadius: "50%",
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
      padding: 0,
      margin: 0,
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

export const OnlineBadge = ({ image, name, isOnline = false }: any) => {
  return isOnline ? (
    <StyledBadge
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      overlap="circular"
      variant="dot"
    >
      <ImageAvatar path={image} alt={name} width={40} height={40} />
    </StyledBadge>
  ) : (
    <ImageAvatar path={image} alt={name} width={40} height={40} />
  );
};
