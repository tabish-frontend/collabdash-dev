import type { ChangeEvent, FC } from "react";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import ArchiveIcon from "@untitled-ui/icons-react/build/esm/Archive";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles/createTheme";

import { Column, Tasks, Attachment } from "src/types";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { SelectMultipleUsers, SeverityPill } from "src/components/shared";
import { useFormik } from "formik";
import { DatePicker } from "@mui/x-date-pickers";
import { Description } from "@mui/icons-material";
import {
  Alert,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Close } from "mdi-material-ui";
import { TaskApi } from "src/api/kanban/tasks";
import ConfirmationAlert from "src/components/shared/ConfirmationAlert";
import { LoadingButton } from "@mui/lab";

export interface TaskModalValues {
  _id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: string;
  assignedTo: string[];
  attachments: Attachment[];
}

export const taskModalInitialValues: TaskModalValues = {
  _id: "",
  title: "",
  description: "",
  dueDate: new Date(),
  priority: "",
  assignedTo: [],
  attachments: [],
};

interface TaskModalProps {
  onClose?: () => void;
  open?: boolean;
  task?: Tasks;
  boardColumns?: Column[];
  boardMembers?: any;
}

const allowedFileTypes = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const TaskModal: FC<TaskModalProps> = (props) => {
  const {
    task,
    boardColumns,
    boardMembers,
    onClose,
    open = false,
    ...other
  } = props;

  const { handleDeleteTask, handleUpdateTask } = useWorkSpace();

  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const [showAlert, setShowAlert] = useState(false);
  const [isFormBeingChanged, setIsFormBeingChanged] = useState(false);

  const formik = useFormik({
    // initialValues: taskModalInitialValues,
    initialValues: task
      ? {
          ...task,
          // assignedTo: task.assignedTo.map((item) => item._id),
          assignedTo: task.assignedTo.map((user: any) => user._id),
          dueDate: new Date(task.dueDate),
        }
      : taskModalInitialValues,
    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      console.log("submit formik values", formik.values);
      setIsFormBeingChanged(false);
      setShowAlert(false);
      const response = await handleUpdateTask(values);
      onClose?.();
      console.log("Modal response", response);
    },
  });

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setIsFormBeingChanged(true);
      formik.setFieldValue("title", event.target.value);
    },
    [formik]
  );

  const handleAttemptClose = () => {
    if (isFormBeingChanged) {
      setShowAlert(true);
    } else {
      onClose?.();
      setIsFormBeingChanged(false);
    }
  };

  const handleConfirmClose = () => {
    setShowAlert(false);
    onClose?.();
    setIsFormBeingChanged(false);
  };

  const handleCancelAlert = () => {
    setShowAlert(false);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log("selectedFile", selectedFile);
    setIsFormBeingChanged(true);
    if (selectedFile) {
      if (allowedFileTypes.includes(selectedFile.type)) {
        const formData = new FormData();
        formData.append("attachment", selectedFile);

        const newAttachment = {
          type: selectedFile?.type,
          name: selectedFile?.name,
          url: URL.createObjectURL(selectedFile),
        };

        // Add the new attachment to the formik values
        formik.setFieldValue("attachments", [
          ...formik.values.attachments,
          newAttachment,
        ]);

        event.target.value = "";

        const responseURL = await TaskApi.submitAttachment(formData);

        formik.setFieldValue("attachments", [
          ...formik.values.attachments,
          {
            ...newAttachment,
            url: responseURL,
          },
        ]);
      } else {
        // Show error toast
        toast.error(
          "Unsupported file format. Please upload a PNG, JPG, PDF, or DOCX file."
        );
      }
    }
  };

  const handleFileRemove = async (cloudinaryUrl: string | undefined) => {
    setIsFormBeingChanged(true);
    if (formik.values.attachments.length) {
      // Filter out the attachment with the given id
      const updatedAttachments = formik.values.attachments.filter(
        (attachment) => attachment.url !== cloudinaryUrl
      );

      formik.setFieldValue("attachments", updatedAttachments);

      const cloudinaryId = cloudinaryUrl?.split("/").pop()?.split(".")[0];
      await TaskApi.deleteAttachment(cloudinaryId);
    }
  };

  const content =
    task && task.column ? (
      <form onSubmit={formik.handleSubmit}>
        <Stack direction={"column"} px={3}>
          <Stack
            alignItems={{
              xs: "center",
            }}
            direction={{
              // xs: "column-reverse",
              xs: "row",
            }}
            justifyContent={{
              xs: "space-between",
            }}
            spacing={1}
          >
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              {mdUp && (
                <IconButton onClick={handleAttemptClose}>
                  <Close />
                </IconButton>
              )}
              {showAlert && (
                <SeverityPill color="error">Unsaved Changes!</SeverityPill>
              )}
            </Stack>

            <Stack
              justifyContent="flex-end"
              alignItems="center"
              direction="row"
              spacing={1}
              sx={{ p: 2 }}
            >
              <IconButton
                onClick={() => {
                  handleDeleteTask(task._id);
                  onClose?.();
                }}
              >
                <SvgIcon>
                  <ArchiveIcon />
                </SvgIcon>
              </IconButton>
              {!mdUp && (
                <IconButton onClick={handleAttemptClose}>
                  <SvgIcon>
                    <XIcon />
                  </SvgIcon>
                </IconButton>
              )}
            </Stack>
          </Stack>

          {showAlert && (
            <ConfirmationAlert
              onConfirm={handleConfirmClose}
              onCancel={handleCancelAlert}
              message="Are you sure you want to close?"
            />
          )}
        </Stack>
        <Box sx={{ px: 3, mt: 2 }}>
          <InputLabel id="label-select" sx={{ mb: 1 }}>
            Task Name
          </InputLabel>

          <Input
            disableUnderline
            fullWidth
            // onBlur={handleNameBlur}
            onChange={handleNameChange}
            // onKeyUp={handleNameKeyUp}
            placeholder="Task name"
            sx={(theme) => ({
              ...theme.typography.h6,
              "& .MuiInputBase-input": {
                borderRadius: 1.5,
                overflow: "hidden",
                px: 1,
                py: 1,
                textOverflow: "ellipsis",
                wordWrap: "break-word",

                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
              },
            })}
            value={formik.values.title}
          />
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid xs={12} sm={4}>
              <Typography color="text.secondary" variant="caption">
                Created by
              </Typography>
            </Grid>
            <Grid xs={12} sm={8}>
              {task.owner && (
                <Tooltip title={task.owner.full_name} arrow>
                  <Avatar src={task.owner.avatar || undefined} />
                </Tooltip>
              )}
            </Grid>
            <Grid xs={12} sm={4}>
              <Typography color="text.secondary" variant="caption">
                Assigned to
              </Typography>
            </Grid>
            <Grid xs={12} sm={8}>
              <SelectMultipleUsers
                employees={boardMembers}
                inputSize="small"
                formikUsers={formik.values.assignedTo}
                setFieldValue={(value: any) => {
                  setIsFormBeingChanged(true);
                  const selectedIds = value.map((user: any) => user._id);
                  formik.setFieldValue("assignedTo", selectedIds);
                }}
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <Typography color="text.secondary" variant="caption">
                Attachments
              </Typography>
            </Grid>
            <Grid xs={12} sm={8}>
              <Stack
                alignItems="start"
                direction="column"
                flexWrap="wrap"
                spacing={1}
              >
                <IconButton
                  component="label"
                  htmlFor="account-settings-upload-image"
                >
                  <SvgIcon fontSize="small">
                    <PlusIcon />
                  </SvgIcon>

                  <input
                    hidden
                    type="file"
                    accept="*"
                    id="account-settings-upload-image"
                    onChange={handleFileChange}
                  />
                </IconButton>

                <Stack direction="row" width="100%" flexWrap="wrap">
                  {formik.values.attachments.map((attachment, index) => (
                    <div
                      key={attachment.url}
                      style={{
                        position: "relative",
                        marginRight: (index + 1) % 3 !== 0 ? "8px" : "0",
                        marginBottom: "8px",
                      }}
                    >
                      {attachment.type.startsWith("image/") ? (
                        <Tooltip title={attachment.name}>
                          <div
                            style={{
                              position: "relative",
                              width: "70px",
                              height: "70px",
                            }}
                          >
                            <Avatar
                              src={attachment.url}
                              sx={{
                                height: "100%",
                                width: "100%",
                                cursor: "pointer",
                                backgroundColor: "transparent", // Avatar background should be transparent
                              }}
                              variant="rounded"
                            />
                            {/* Black overlay with low opacity */}
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                cursor: "pointer",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.4)", // Black with 50% opacity
                                borderRadius: "10px",
                              }}
                              onClick={() =>
                                window.open(attachment.url, "_blank")
                              }
                            ></div>
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip title={attachment.name}>
                          <div
                            style={{
                              position: "relative",
                              width: "70px",
                              height: "70px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              backgroundColor: "#efefef",
                              borderRadius: "10px",
                            }}
                            onClick={() =>
                              window.open(attachment.url, "_blank")
                            }
                          >
                            <Description sx={{ fontSize: 50 }} />
                            {/* Black overlay with low opacity */}
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.4)", // Black with 50% opacity
                                borderRadius: "10px",
                              }}
                            ></div>
                          </div>
                        </Tooltip>
                      )}

                      <IconButton
                        onClick={() => handleFileRemove(attachment.url)}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          zIndex: 2,
                          height: 25,
                          width: 25,
                        }}
                      >
                        <Close sx={{ width: "20px", color: "white" }} />
                      </IconButton>
                    </div>
                  ))}
                </Stack>
              </Stack>
            </Grid>
            <Grid xs={12} sm={4}>
              <Typography color="text.secondary" variant="caption">
                Due date
              </Typography>
            </Grid>
            <Grid xs={12} sm={8}>
              <DatePicker
                views={["year", "month", "day"]}
                sx={{ width: "100%" }}
                value={formik.values.dueDate}
                onChange={(date: Date | null) => {
                  setIsFormBeingChanged(true);
                  formik.setFieldValue("dueDate", date || new Date()); // Ensure a Date value is set
                }}
                label="Select Due Date"
                slotProps={{
                  textField: {
                    size: "small", // Set the input size to small
                    fullWidth: true, // Make the input take full width
                  },
                }}
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <Typography color="text.secondary" variant="caption">
                Priority
              </Typography>
            </Grid>
            <Grid xs={12} sm={8}>
              <FormControl fullWidth size="small">
                <InputLabel id="label-select">Select Priority</InputLabel>
                <Select
                  labelId="label-select"
                  id="demo-controlled-open-select"
                  value={formik.values.priority} // Assuming single label selection for simplicity
                  onChange={(event) => {
                    setIsFormBeingChanged(true);
                    formik.setFieldValue("priority", event.target.value); // Replace array with selected value
                  }}
                  label="Select Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <Typography color="text.secondary" variant="caption">
                Description
              </Typography>
            </Grid>
            <Grid xs={12} sm={8}>
              <Input
                value={formik.values.description}
                onChange={(e) => {
                  setIsFormBeingChanged(true);
                  formik.setFieldValue("description", e.target.value);
                }}
                fullWidth
                multiline
                disableUnderline
                placeholder="Leave a message"
                rows={6}
                sx={{
                  borderColor: "divider",
                  borderRadius: 1,
                  borderStyle: "solid",
                  borderWidth: 1,
                  p: 1,
                }}
              />
            </Grid>

            <Grid xs={12}>
              <Stack direction={"row"} justifyContent={"flex-end"}>
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
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </form>
    ) : null;

  return (
    <Drawer
      anchor="right"
      onClose={handleAttemptClose}
      open={open}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 500,
        },
      }}
      {...other}
    >
      {content}
    </Drawer>

    // <Dialog
    //   fullWidth
    //   maxWidth="md"
    //   onClose={handleAttemptClose}
    //   open={open}
    //   PaperProps={{
    //     sx: {
    //       width: "100%",
    //       maxWidth: 500,
    //     },
    //   }}
    //   {...other}
    // >
    //   {content}
    // </Dialog>
  );
};
