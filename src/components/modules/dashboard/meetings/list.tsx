import { Box, Container, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useSettings } from "src/hooks";
import { DashboardLayout } from "src/layouts";

const MeetingListComponent = () => {
  const settings = useSettings();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={settings.stretch ? false : "xl"}>
        <Stack
          spacing={{
            xs: 3,
            lg: 4,
          }}
        >
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <div>
              <Typography variant="h4">Schedule Meetings</Typography>
            </div>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

const MeetingList: NextPage = () => {
  return <MeetingListComponent />;
};

MeetingList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { MeetingList };
