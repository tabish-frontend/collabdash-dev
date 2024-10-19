import type { FC } from "react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useDispatch } from "src/store";
import { thunks } from "src/thunks/calendar";
import { LoadingButton } from "@mui/lab";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
} from "@mui/material";

import { SelectMultipleUsers } from "src/components/shared";
import { meetingInitialValues } from "src/formik";
import { Contact } from "src/types";
import { contactsApi } from "src/api";
import { weekDays } from "src/constants/days";
import { TimePicker } from "@mui/x-date-pickers";

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Title cannot contain special characters"),
});

interface NewTaskProps {
  onAddComplete?: () => void;
  onClose?: () => void;
  range?: { start: number };
}

export const CreateMeetingEvent: FC<NewTaskProps> = (props) => {
  const { onAddComplete, onClose, range } = props;

  const [employees, setEmployees] = useState<Contact[]>([]);

  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...meetingInitialValues,
      time: range ? new Date(range.start) : null,
    },
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await dispatch(thunks.createEvent({ eventType: "meeting", values }));
        onAddComplete?.();
      } catch (err) {
        console.error(err);
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleGetEmployees = async () => {
    const response = await contactsApi.getContacts({
      query: "",
    });
    setEmployees(response);
  };

  useEffect(() => {
    handleGetEmployees();
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack
        spacing={2}
        sx={{ p: 2 }}
        direction={"column"}
        alignItems={"flex-start"}
      >
        <TextField
          fullWidth
          label="Meeting Title"
          required
          value={formik.values.title}
          name="title"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.title && formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />

        <SelectMultipleUsers
          label="Select Participants"
          employees={employees}
          formikUsers={formik.values.participants.map((user: any) => user._id)}
          setFieldValue={(value: any) =>
            formik.setFieldValue("participants", value)
          }
        />

        <FormControlLabel
          control={
            <Switch
              color="info"
              name="recurring"
              checked={formik.values.recurring}
              onChange={formik.handleChange}
              value={formik.values.recurring}
            />
          }
          label="Recurring"
          labelPlacement="start"
        />

        {formik.values.recurring ? (
          <>
            <FormControl fullWidth required>
              <InputLabel>Meeting Days</InputLabel>
              <Select
                multiple
                name="meeting_days"
                value={formik.values.meeting_days}
                onChange={formik.handleChange}
                input={<OutlinedInput label="Meeting Days" />}
              >
                {weekDays.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TimePicker
              sx={{ width: "100%", mt: 2 }}
              label="Select Time"
              value={formik.values.time}
              onChange={(date: Date | null) => {
                formik.setFieldValue("time", date);
              }}
            />
          </>
        ) : (
          <DateTimePicker
            sx={{ width: "100%" }}
            label="Select Date and Time"
            value={formik.values.time}
            onChange={(date: Date | null) => {
              formik.setFieldValue("time", date);
            }}
          />
        )}
      </Stack>

      <Divider />

      <Stack
        justifyContent={"flex-end"}
        alignItems="center"
        direction={"row"}
        spacing={1}
        sx={{ p: 2 }}
      >
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={formik.isSubmitting}
          loadingPosition="start"
          type="submit"
          startIcon={<></>}
          variant="contained"
          sx={{
            pl: formik.isSubmitting ? "40px" : "16px",
          }}
        >
          Confirm
        </LoadingButton>
      </Stack>
    </form>
  );
};
