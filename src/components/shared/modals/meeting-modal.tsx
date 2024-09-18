import {
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Paper,
  InputAdornment,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { Calendar, CloseCircleOutline } from "mdi-material-ui";
import { useEffect, useState, type FC } from "react";
import { employeesApi } from "src/api";
import { Employee, WorkSpace } from "src/types";
import { SelectMultipleUsers } from "src/components/shared";
import { LoadingButton } from "@mui/lab";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export interface Meeting {
  _id: string;
  title: string;
  date: any;
  members: Employee[];
}

export const meetingInitialValues: Meeting = {
  _id: "", // default empty string for new meeting
  title: "", // default title
  date: new Date(), // default current date
  members: [], // default empty array for members
};

interface MeetingModalProps {
  modal: boolean;
  modalType?: string;
  meetingValues: Meeting;
  onCancel: () => void;
}

export const MeetingModal: FC<MeetingModalProps> = ({
  modal,
  modalType,
  meetingValues,
  onCancel,
}) => {
  const formik = useFormik({
    initialValues: meetingValues,
    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      // if (madal_type === "Update") {
      //   await handleUpdateWorkSpace({
      //     _id: values._id,
      //     name: values.name,
      //     members: values.members,
      //   });
      // } else {
      //   await handleAddWorkSpace(values);
      // }

      // helpers.setStatus({ success: true });
      // helpers.setSubmitting(false);
      onCancel();
    },
  });

  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleGetEmployees = async () => {
    const response = await employeesApi.getAllEmployees({
      fields: "full_name,avatar,department",
      account_status: "active",
      search: "",
      role: "",
    });
    setEmployees(response.users);
  };

  useEffect(() => {
    handleGetEmployees();
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={modal}
      onClose={onCancel}
      sx={{ "& .MuiPaper-root": { overflowY: "unset" } }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Paper elevation={12}>
          <DialogTitle sx={{ m: 0, p: 3, fontSize: 24, fontWeight: 600 }}>
            {`${modalType === "create" ? "Create" : "Update"} Meeting`}
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

          <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meeting Title"
                required
                value={formik.values.title}
                name="title"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <SelectMultipleUsers
                employees={employees}
                formikUsers={formik.values.members.map((user: any) => user._id)}
                isRequired={!formik.values.members.length}
                setFieldValue={(value: any) =>
                  formik.setFieldValue("members", value)
                }
                label="Select Participants"
              />
            </Grid>
            <Grid item xs={12}>
              <MobileDateTimePicker
                value={formik.values.date}
                onChange={(date: Date | null) => {
                  formik.setFieldValue("date", date || new Date());
                }}
                label="Select Date and Time"
                sx={{
                  width: "100%",
                }}
                slotProps={{
                  textField: {
                    InputProps: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{ cursor: "pointer" }}
                        >
                          <Calendar />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

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
