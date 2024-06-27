import Link from "next/link";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";
import type { NextPage } from "next";
import { paths } from "src/constants/paths";
import { Stack, SvgIcon } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const Img = styled("img")(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down("lg")]: {
    height: 450,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down("md")]: {
    height: 400,
  },
  [theme.breakpoints.up("lg")]: {
    marginTop: theme.spacing(13),
  },
}));

const Page: NextPage = () => {
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
  }, [router, signOut]);

  return (
    <Box className="content-center">
      <Stack justifyContent={"flex-end"} direction={"row"} margin={2}>
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
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <BoxWrapper>
          <Typography variant="h1">404</Typography>
          <Typography
            variant="h5"
            sx={{ mb: 1, fontSize: "1.5rem !important" }}
          >
            Page Not Found ⚠️
          </Typography>
          <Typography variant="body2">
            We couldn&prime;t find the page you are looking for.
          </Typography>
        </BoxWrapper>
        <Img
          height="487"
          alt="error-illustration"
          src="/images/pages/404.png"
        />
        <Link passHref href={paths.index}>
          <Button component="a" variant="contained" sx={{ px: 5.5 }}>
            Back to Home
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Page;
