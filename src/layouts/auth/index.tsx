import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import { GuestGuard } from "src/components";

const LayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top center",
  backgroundImage: 'url("/assets/gradient-bg.svg")',
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
