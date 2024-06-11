import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles/createTheme";

import { RouterLink } from "src/components/shared";
import { Seo } from "src/components/shared/seo";
import { usePageView } from "src/hooks/use-page-view";
import { paths } from "src/constants/paths";
import { Stack, SvgIcon } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";

const Page: NextPage = () => {
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  usePageView();

  const router = useRouter();

  const { signOut } = useAuth<AuthContextType>();

  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      signOut();
      router.replace(paths.auth.login);
      localStorage.removeItem("temporary_password");
    } catch (err) {
      toast.error("Something went wrong!");
    }
  }, [router]);

  return (
    <>
      <Seo title="Error: Not Found" />
      <Stack justifyContent={"flex-end"} direction={"row"} margin={5}>
        <Button
          size="medium"
          color="error"
          onClick={handleLogout}
          startIcon={
            <SvgIcon>
              <LogoutIcon />
            </SvgIcon>
          }
        >
          Logout
        </Button>
      </Stack>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          py: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 6,
            }}
          >
            <Box
              alt="Not found"
              component="img"
              src="/assets/errors/error-404.svg"
              sx={{
                height: "auto",
                maxWidth: "100%",
                width: 200,
              }}
            />
          </Box>
          <Typography align="center" variant={mdUp ? "h1" : "h4"}>
            404: The page you are looking for isn’t here
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mt: 0.5 }}>
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
            }}
          >
            <Button component={RouterLink} href={paths.index}>
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Page;
