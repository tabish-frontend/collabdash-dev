// ** React Imports
import { SyntheticEvent, useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTab, { TabProps } from "@mui/material/Tab";

// ** Icons Imports
import {
  AccountOutline,
  LockOpenOutline,
  InformationOutline,
  Bank,
} from "mdi-material-ui";

// ** Demo Tabs Imports
import { TabAccount, TabSecurity, TabInfo, TabBank } from "./tabs";

// ** Third Party Styles Imports
import { useRouter } from "next/router";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import { CardContent, Container, Stack } from "@mui/material";
import { useSettings } from "src/hooks";

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    minWidth: 100,
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: 67,
  },
}));

const TabName = styled("span")(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: "0.875rem",
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const AccountSettingsComponent = () => {
  const router = useRouter();
  const settings = useSettings();

  const { tab } = router.query;

  // ** State

  const [tabValue, setTabValue] = useState<string | string[] | undefined>(
    tab ? tab : "account"
  );

  useEffect(() => {
    setTabValue(tab);
  }, [router]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 4,
      }}
    >
      <Container maxWidth={!settings.stretch ? false : "xl"}>
        <Stack
          spacing={{
            xs: 3,
            lg: 4,
          }}
        >
          <Card>
            <CardContent>
              <TabContext value={tabValue as string}>
                <TabList
                  onChange={handleChange}
                  aria-label="account-settings tabs"
                  sx={{
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Tab
                    value="account"
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccountOutline />
                        <TabName>Account</TabName>
                      </Box>
                    }
                  />
                  <Tab
                    value="security"
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LockOpenOutline />
                        <TabName>Security</TabName>
                      </Box>
                    }
                  />
                  <Tab
                    value="info"
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <InformationOutline />
                        <TabName>Info</TabName>
                      </Box>
                    }
                  />
                  <Tab
                    value="bank"
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Bank />
                        <TabName>Bank Details</TabName>
                      </Box>
                    }
                  />
                </TabList>

                <TabPanel sx={{ p: 0 }} value="account">
                  <TabAccount />
                </TabPanel>

                <TabPanel sx={{ p: 0 }} value="security">
                  <TabSecurity />
                </TabPanel>

                <TabPanel sx={{ p: 0 }} value="info">
                  <TabInfo />
                </TabPanel>

                <TabPanel sx={{ p: 0 }} value="bank">
                  <TabBank />
                </TabPanel>
              </TabContext>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

const AccountSettings: NextPage = () => {
  return <AccountSettingsComponent />;
};

AccountSettings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { AccountSettings };
