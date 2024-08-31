import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { GuestGuard } from "src/components";
import { Typography } from "@mui/material";

const LayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top center",
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  height: "100%",
}));

interface LayoutProps {
  children: ReactNode;
}

export const AuthLayout: FC<LayoutProps> = (props) => {
  const { children } = props;

  return (
    <GuestGuard>
      <LayoutRoot>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            flex: "1 1 auto",
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              py: {
                xs: "60px",
                md: "120px",
              },
            }}
          >
            <Box
              sx={{
                mb: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/assets/logos/work-dock-logo.png"
                alt="logo"
                width={50}
              />
              <Typography
                variant="h6"
                sx={{
                  ml: 1,
                  lineHeight: 1,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "1.5rem !important",
                  fontFamily: "Poppins-SemiBold, Poppins",
                }}
              >
                Work Dock
              </Typography>
            </Box>
            {children}
          </Container>
        </Box>
      </LayoutRoot>
    </GuestGuard>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
};
