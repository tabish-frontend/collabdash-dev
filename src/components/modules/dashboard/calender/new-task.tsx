import type { FC } from "react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useDispatch } from "src/store";
import { thunks } from "src/thunks/calendar";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { MenuItem, Typography } from "@mui/material";
import { taskModalInitialValues } from "src/components/shared";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { DateTimePicker } from "@mui/x-date-pickers";

export const Priorities = [
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Moderate",
    value: "moderate",
  },
  {
    label: "High",
    value: "high",
  },
];

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

export const CreateTaskEvent: FC<NewTaskProps> = (props) => {
  const { onAddComplete, onClose, range } = props;

  const { user } = useAuth<AuthContextType>();

  const [workSpaceId, setWorkSpaceId] = useState<string>("");

  const { getWorkSpaceOptions, getBoardOptions, handleAddTask } =
    useWorkSpace();

  const workSpaceOptions = getWorkSpaceOptions(user!._id, user!.role);
  const boardOptions = getBoardOptions(workSpaceId);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...taskModalInitialValues,
      dueDate: range ? new Date(range.start) : null,
      priority: "moderate",
      column: "",
      board: "",
    },
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await handleAddTask(values);
        onAddComplete?.();
      } catch (err) {
        console.error(err);
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2} sx={{ p: 2 }}>
        <TextField
          fullWidth
          label="Task Title"
          required
          value={formik.values.title}
          name="title"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.title && formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />

        <TextField
          fullWidth
          select
          required
          label="Select WorkSpace"
          name="workSpaceId"
          value={workSpaceId}
          onChange={(e) => setWorkSpaceId(e.target.value)}
        >
          {workSpaceOptions.map((option: any) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          required
          disabled={!workSpaceId}
          label="Select Board"
          name="board"
          value={formik.values.board}
          onChange={(e: any) => {
            const selectedBoard = boardOptions.find(
              (option: any) => option._id === e.target.value
            );

            formik.setFieldValue("board", selectedBoard._id); // Set the entire board object
            formik.setFieldValue("column", selectedBoard.columns[0]); // Set the first column
          }}
        >
          {boardOptions.map((option: any) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>

        <DateTimePicker
          label="Due Date"
          value={formik.values.dueDate}
          onChange={(date: Date | null) => {
            formik.setFieldValue("dueDate", date || new Date());
          }}
        />
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
