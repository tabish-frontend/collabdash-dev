// ** MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";

// ** Types Imports
import {
  Box,
  Button,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ShiftModal } from "../modals";
import { shiftApi } from "src/api";
import { Shift } from "src/types";
import { formatTime, getAbbreviatedDays } from "src/utils/helpers";
import { Pencil } from "mdi-material-ui";

export const ShiftDetails = ({
  employeeID,
  shiftDetails,
}: {
  employeeID: string | undefined;
  shiftDetails: Shift | undefined;
}) => {
  const [shiftModal, setshiftModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [employeeShift, setEmployeeShift] = useState(shiftDetails);

  const addAndUpdateShift = async (values: any) => {
    const { _id, ...shiftValues } = values;

    let response: any;

    if (modalType === "update") {
      response = await shiftApi.updateShift(_id, shiftValues);
    } else {
      response = await shiftApi.addShift({ ...shiftValues, user: employeeID });
    }
    setshiftModal(false);
    setEmployeeShift(response.data);
  };

  useEffect(() => {
    setEmployeeShift(shiftDetails);
  }, [shiftDetails]);

  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Card sx={{ position: "relative" }}>
        {employeeShift && (
          <Box sx={{ position: "absolute", top: 20, right: 15 }}>
            <SvgIcon
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setshiftModal(true);
                setModalType("update");
              }}
            >
              <Pencil />
            </SvgIcon>
          </Box>
        )}
        <CardHeader title={"Shift Details"} />
        <CardContent>
          {employeeShift && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack direction={isSmallScreen ? "column" : "row"} spacing={3}>
                  <Typography variant="subtitle1" fontWeight={900}>
                    Shift Type :
                  </Typography>
                  <Typography variant="subtitle1">
                    {employeeShift.shift_type}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction={isSmallScreen ? "column" : "row"} spacing={3}>
                  <Typography variant="subtitle1" fontWeight={900}>
                    Weekends :
                  </Typography>
                  <Typography variant="subtitle1">
                    {employeeShift.weekends.join(", ")}
                  </Typography>
                </Stack>
              </Grid>

              {employeeShift.shift_type === "Flexible" ? (
                <Grid item xs={12}>
                  <Stack
                    direction={isSmallScreen ? "column" : "row"}
                    spacing={3}
                  >
                    <Typography variant="subtitle1" fontWeight={900}>
                      Hours :
                    </Typography>
                    <Typography variant="subtitle1">
                      {`${employeeShift.hours} hours/day`}
                    </Typography>
                  </Stack>
                </Grid>
              ) : (
                employeeShift.times.map((shift, index) => (
                  <Grid item xs={12} key={index}>
                    <Stack
                      direction={isSmallScreen ? "column" : "row"}
                      spacing={3}
                    >
                      <Typography variant="subtitle1">
                        <b>Start Time :</b> {formatTime(shift.start)}
                      </Typography>
                      <Typography variant="subtitle1">
                        <b>End Time :</b> {formatTime(shift.end)}
                      </Typography>
                      <Typography variant="subtitle1">
                        <b>Days :</b>{" "}
                        {getAbbreviatedDays(shift.days).join(", ")}
                      </Typography>
                    </Stack>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {!employeeShift && (
            <Grid container spacing={2} mt={3}>
              <Grid item xs={12} md={6} mx="auto" textAlign="center">
                <Typography pb="1rem" variant="subtitle1">
                  Sorry, there are no shifts available at the moment.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setModalType("create");
                    setshiftModal(true);
                  }}
                >
                  Add Shift
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {shiftModal && (
        <ShiftModal
          modalType={modalType}
          shiftValues={employeeShift}
          modal={shiftModal}
          onCancel={() => {
            setshiftModal(false);
          }}
          onConfirm={addAndUpdateShift}
        />
      )}
    </>
  );
};
