import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { GuestGuard, Logo } from "src/components";
import { useTheme } from "@mui/material";

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

  const theme = useTheme();

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
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  height: 150,
                  width: 400,
                }}
              >
                <Logo
                  color={theme.palette.mode === "dark" ? "#f1f2f2" : "#00455e"}
                />
              </Box>
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
