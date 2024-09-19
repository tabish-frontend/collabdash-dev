import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export const SkeletonMeetingCard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card sx={{ position: "relative" }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={50} height={50} />}
        title={<Skeleton variant="rectangular" width="100%" height={20} />}
        subheader={
          <Skeleton variant="text" width="100%" height={10} sx={{ mt: 1 }} />
        }
        action={
          <Stack direction="row" spacing={0.5} ml={3} mt={1}>
            <Skeleton variant="circular" width={25} height={25} />
            <Skeleton variant="circular" width={25} height={25} />
          </Stack>
        }
      />
      <CardContent sx={{ paddingTop: 2 }}>
        <Stack direction={"column"} minHeight={80} spacing={1}>
          <Skeleton variant="rectangular" width="100%" height={20} />
          <Stack
            direction={isSmallScreen ? "column" : "column"}
            justifyContent={"space-between"}
            alignItems={isSmallScreen ? "flex-start" : "center"}
            spacing={2}
            flexWrap={"wrap"}
          >
            <Skeleton variant="rectangular" width="100%" height={15} />
            <Stack
              direction={"row"}
              justifyContent={"flex-start"}
              width={"100%"}
            >
              <Skeleton variant="circular" width={25} height={25} />
              <Skeleton variant="circular" width={25} height={25} />
              <Skeleton variant="circular" width={25} height={25} />
            </Stack>
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          pt={2}
        >
          <Skeleton variant="rounded" width={120} height={20} />
          <Stack direction="row" spacing={0.5} ml={3} mt={1}>
            <Skeleton variant="circular" width={25} height={25} />
            <Skeleton variant="circular" width={25} height={25} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
