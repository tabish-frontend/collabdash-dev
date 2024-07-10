import {
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  SelectChangeEvent,
  SvgIcon,
  TextField,
  InputAdornment,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { CloseCircleOutline, MinusBoxOutline, Plus } from "mdi-material-ui";

import { useEffect, type FC } from "react";
import { shiftInitialValues } from "src/formik";

import { weekDays } from "src/constants/days";
import { TimePicker } from "@mui/x-date-pickers";
import { Shift } from "src/types";
import { LoadingButton } from "@mui/lab";

interface ShiftModalProps {
  modal: boolean;
  modalType: string;
  shiftValues: Shift | undefined;
  onConfirm: (values: any) => void;
  onCancel: () => void;
}

export const ShiftModal: FC<ShiftModalProps> = ({
  modal,
  modalType,
  shiftValues,
  onCancel,
  onConfirm,
}) => {
  const formik = useFormik({
    initialValues: shiftValues
      ? {
          ...shiftValues,
          times: shiftValues.times.map((time) => {
            return {
              days: time.days,
              start: time.start ? new Date(time.start) : null,
              end: time.end ? new Date(time.end) : null,
            };
          }),
          weekends: shiftValues.weekends,
        }
      : shiftInitialValues,
    onSubmit: async (values, helpers): Promise<void> => {
      onConfirm(values);
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
    },
  });

  const getShiftDays = (weekends: string[]) => {
    return weekDays.filter((day) => !weekends.includes(day));
  };

  const handleweekendsChange = (event: SelectChangeEvent<string[]>) => {
    const selectedweekends = event.target.value;

    formik.setFieldValue("weekends", selectedweekends);
    const updatedShiftDays = formik.values.times.map((item) => {
      const filteredDays = item.days.filter(
        (day) => !selectedweekends.includes(day)
      );

      return { ...item, days: filteredDays };
    });

    formik.setFieldValue("times", updatedShiftDays);
  };

  const handleShiftTypeChange = (e: { target: { value: any } }) => {
    const newShiftType = e.target.value;
    formik.setValues({
      ...shiftInitialValues,
      _id: formik.values._id,
      shift_type: newShiftType,
    });
  };

  const addShift = () => {
    const newShiftValues = {
      start: null,
      end: null,
      days: [],
    };

    formik.setFieldValue("times", [...formik.values.times, newShiftValues]);
  };

  const removeShift = (index: number) => {
    const updatedShiftValues = [
      ...formik.values.times.slice(0, index),
      ...formik.values.times.slice(index + 1),
    ];
    formik.setFieldValue("times", updatedShiftValues);
  };

  return (
    <Dialog fullWidth maxWidth={"md"} open={modal} onClose={onCancel}>
      <form onSubmit={formik.handleSubmit}>
        <Paper elevation={12}>
          <DialogTitle sx={{ m: 0, p: 3, fontSize: 24, fontWeight: 600 }}>
            {modalType === "create" ? "Add Shift" : "Update Shift"}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onCancel}
            sx={{
              position: "absolute",
              right: 12,
              top: 16,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseCircleOutline />
          </IconButton>

          <Divider />

          <Grid container spacing={4} p={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Shift Type"
                value={formik.values.shift_type}
                name="shift_type"
                select
                fullWidth
                required
                onChange={handleShiftTypeChange}
              >
                {["Fixed", "Flexible"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>weekends</InputLabel>
                <Select
                  multiple
                  value={formik.values.weekends}
                  onChange={handleweekendsChange}
                  input={<OutlinedInput label="weekends" />}
                >
                  {weekDays.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {formik.values.shift_type === "Fixed" ? (
            <>
              {formik.values.times.map((input: any, index: number) => {
                const fieldName = `times[${index}]`;

                return (
                  <Grid container spacing={4} p={2} key={index}>
                    <Grid item xs={12} sm={3}>
                      <TimePicker
                        sx={{ width: "100%" }}
                        label="Start Time"
                        value={input.start}
                        onChange={(time) => {
                          formik.setFieldValue(`${fieldName}.start`, time);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TimePicker
                        sx={{ width: "100%" }}
                        label="End Time"
                        value={input.end}
                        onChange={(time) => {
                          formik.setFieldValue(`${fieldName}.end`, time);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <FormControl fullWidth>
                        <InputLabel>Days</InputLabel>
                        <Select
                          multiple
                          value={input.days}
                          onChange={(event: SelectChangeEvent<string[]>) => {
                            formik.setFieldValue(
                              `${fieldName}.days`,
                              event.target.value
                            );
                          }}
                          input={
                            <OutlinedInput
                              label="Days"
                              id="select-multiple-language"
                            />
                          }
                        >
                          {getShiftDays(formik.values.weekends).map(
                            (option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    {index > 0 && (
                      <Grid item xs={12} sm={1} mt={2}>
                        <IconButton onClick={() => removeShift(index)}>
                          <SvgIcon>
                            <MinusBoxOutline color="warning" />
                          </SvgIcon>
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                );
              })}

              <Grid item xs={12} sm={12} ml={2} mt={3}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={addShift}
                  startIcon={
                    <SvgIcon>
                      <Plus />
                    </SvgIcon>
                  }
                >
                  Add More
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={12} sm={6} ml={2}>
              <TextField
                type="number"
                label="Hours Per Day"
                name="hours"
                onChange={formik.handleChange}
                value={formik.values.hours}
                sx={{ width: 260 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">/day</InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              pb: 3,
              px: 3,
            }}
          >
            <Button color="inherit" sx={{ mr: 2 }} onClick={onCancel}>
              Cancel
            </Button>

            <LoadingButton
              loading={formik.isSubmitting}
              loadingPosition="start"
              startIcon={<></>}
              type="submit"
              variant="contained"
              sx={{
                pl: formik.isSubmitting ? "40px" : "16px",
              }}
            >
              Save
            </LoadingButton>
          </Box>
        </Paper>
      </form>
    </Dialog>
  );
};
