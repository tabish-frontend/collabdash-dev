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
import { FC, useEffect, useState } from "react";
import { ShiftModal } from "../modals";
import { shiftApi } from "src/api";
import { Shift } from "src/types";
import { formatTime, getAbbreviatedDays } from "src/utils/helpers";
import { Pencil } from "mdi-material-ui";
import { useDialog } from "src/hooks";
import React from "react";

interface ShiftDetailsProps {
  employeeID: string | undefined;
  shiftDetails: Shift | undefined;
}

export const ShiftDetails: FC<ShiftDetailsProps> = ({
  employeeID,
  shiftDetails,
}) => {
  const [employeeShift, setEmployeeShift] = useState(shiftDetails);
  const ShiftDialog = useDialog<{ type: string }>();

  const addAndUpdateShift = async (values: any) => {
    const { _id, ...shiftValues } = values;

    let response: any;

    if (ShiftDialog.data?.type === "update") {
      response = await shiftApi.updateShift(_id, shiftValues);
    } else {
      response = await shiftApi.addShift({ ...shiftValues, user: employeeID });
    }
    setEmployeeShift(response.data);
    ShiftDialog.handleClose();
  };

  useEffect(() => {
    setEmployeeShift(shiftDetails);
  }, [shiftDetails]);

  const theme = useTheme();

  const isLargeScreen = useMediaQuery(theme.breakpoints.down("xl"));

  return (
    <>
      <Card sx={{ position: "relative", height: isLargeScreen ? 562 : 322 }}>
        {employeeShift && (
          <Box sx={{ position: "absolute", top: 20, right: 15 }}>
            <SvgIcon
              sx={{ cursor: "pointer" }}
              onClick={() => {
                ShiftDialog.handleOpen({
                  type: "update",
                });
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
                <Stack direction="row" spacing={4} alignItems="flex-start">
                  {/* Left Column for Labels */}
                  <Stack direction="column" spacing={2}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Shift Type:
                    </Typography>

                    {employeeShift.shift_type === "Flexible" ? (
                      <Typography variant="subtitle1" fontWeight={600}>
                        Hours:
                      </Typography>
                    ) : (
                      <>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Working Days:
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Start Time:
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600}>
                          End Time:
                        </Typography>
                      </>
                    )}

                    <Typography variant="subtitle1" fontWeight={600}>
                      Off Days:
                    </Typography>
                  </Stack>

                  {/* Right Column for Values */}
                  <Stack direction="column" spacing={2}>
                    <Typography variant="subtitle1">
                      {employeeShift.shift_type}
                    </Typography>

                    {employeeShift.shift_type === "Flexible" ? (
                      <Typography variant="subtitle1">
                        {`${employeeShift.hours} hours/day`}
                      </Typography>
                    ) : (
                      employeeShift.times.map((shift, index) => (
                        <React.Fragment key={index}>
                          <Typography variant="subtitle1">
                            {getAbbreviatedDays(shift.days).join(", ")}
                          </Typography>
                          <Typography variant="subtitle1">
                            {formatTime(shift.start)}
                          </Typography>
                          <Typography variant="subtitle1">
                            {formatTime(shift.end)}
                          </Typography>
                        </React.Fragment>
                      ))
                    )}

                    <Typography variant="subtitle1">
                      {employeeShift.weekends.join(", ")}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
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
                    ShiftDialog.handleOpen({
                      type: "create",
                    });
                  }}
                >
                  Add Shift
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {ShiftDialog.open && (
        <ShiftModal
          modalType={ShiftDialog.data?.type}
          shiftValues={employeeShift}
          modal={ShiftDialog.open}
          onCancel={ShiftDialog.handleClose}
          onConfirm={addAndUpdateShift}
        />
      )}
    </>
  );
};
