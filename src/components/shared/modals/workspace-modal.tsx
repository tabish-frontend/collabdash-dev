import {
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { CloseCircleOutline } from "mdi-material-ui";
import { useEffect, useState, type FC } from "react";
import { employeesApi } from "src/api";
import { Employee, WorkSpace } from "src/types";
import { SelectMultipleUsers } from "src/components/shared";
import { LoadingButton } from "@mui/lab";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { workSpaceInitialValues } from "src/formik";

interface WorkspaceModalProps {
  modal: boolean;
  madal_type?: string;
  workSpaceValues: WorkSpace;
  onCancel: () => void;
}

export const WorkspaceModal: FC<WorkspaceModalProps> = ({
  modal,
  madal_type,
  workSpaceValues,
  onCancel,
}) => {
  const { handleAddWorkSpace, handleUpdateWorkSpace } = useWorkSpace();

  const formik = useFormik({
    initialValues: {
      ...workSpaceValues,
      members: workSpaceValues.members.map((user: any) => user._id),
    },

    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      if (madal_type === "Update") {
        await handleUpdateWorkSpace({
          _id: values._id,
          name: values.name,
          members: values.members,
        });
      } else {
        await handleAddWorkSpace(values);
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
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
            {`${madal_type} Workspace`}
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
                label="Title"
                required
                value={formik.values.name}
                name="name"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <SelectMultipleUsers
                employees={employees}
                formikUsers={formik.values.members}
                setFieldValue={(value: any) =>
                  formik.setFieldValue("members", value)
                }
                isRequired={!formik.values.members.length}
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
