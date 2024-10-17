import type { ChangeEvent, FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ArchiveIcon from "@untitled-ui/icons-react/build/esm/Archive";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
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
import {
  SelectMultipleUsers,
  SeverityPill,
  ConfirmationAlert,
  ConfirmationModal,
} from "src/components/shared";
import { useFormik } from "formik";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { AttachFile, Delete, Description } from "@mui/icons-material";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import {
  Alert,
  Button,
  Dialog,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import { Calendar, Close } from "mdi-material-ui";
import { TaskApi } from "src/api/kanban/tasks";
import { LoadingButton } from "@mui/lab";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Priorities } from "src/constants/list-items";
import { useDialog } from "src/hooks";
import { useDispatch } from "src/store";
import { thunks } from "src/thunks/calendar";

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
}

interface DeleteTaskDialogData {
  id: any;
}

const allowedFileTypes = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx files
  "application/msword",
  "text/plain",
  "video/mp4",
  "audio/mpeg",
  "text/csv", // CSV files
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx files
];

export const TaskModal: FC<TaskModalProps> = (props) => {
  const { task, onClose, open = false, ...other } = props;

  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const DeleteTaskDialog = useDialog<DeleteTaskDialogData>();

  const { handleDeleteTask, handleUpdateTask, getBoardMembersByTaskId } =
    useWorkSpace();
  const boardMembers = getBoardMembersByTaskId(task!._id);
  const theme = useTheme();

  const [showAlert, setShowAlert] = useState(false);
  const [isFormBeingChanged, setIsFormBeingChanged] = useState(false);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: task
      ? {
          ...task,
          dueDate: new Date(task.dueDate),
        }
      : taskModalInitialValues,
    onSubmit: async (values, helpers): Promise<void> => {
      setIsFormBeingChanged(false);
      setShowAlert(false);
      await handleUpdateTask(values);

      await dispatch(
        thunks.updateEvent({
          eventId: values._id,
          eventType: "task",
          update: values,
        })
      );
      onClose?.();
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

  const handleDelete = async () => {
    await dispatch(
      thunks.deleteEvent({
        eventId: DeleteTaskDialog.data!.id as string,
        eventType: "task",
      })
    );
    handleDeleteTask(DeleteTaskDialog.data?.id);
    onClose?.();
  };

  // Memoize the toolbar styles to update based on the theme
  const customToolbarStyles = useMemo(() => {
    return {
      ".ql-toolbar": {
        borderColor: theme.palette.divider,
      },
      ".ql-toolbar .ql-picker": {
        color: theme.palette.text.primary,
      },
      ".ql-toolbar .ql-stroke": {
        stroke: theme.palette.text.primary,
      },
      ".ql-picker-options": {
        backgroundColor: theme.palette.background.default,
      },
      ".ql-snow .ql-tooltip": {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        left: "0 !important",
        boxShadow: "none",
      },
      ".ql-snow .ql-tooltip.ql-editing input[type=text]": {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
    };
  }, [theme]);

  return (
    <Dialog
      onClose={handleAttemptClose}
      open={open}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 900,
        },
      }}
      {...other}
    >
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
            {/* <Stack direction={"row"} spacing={2} alignItems={"center"}> */}
            {showAlert && (
              <SeverityPill color="error">Unsaved Changes!</SeverityPill>
            )}

            <Stack
              justifyContent="flex-end"
              alignItems="center"
              direction="row"
              spacing={1}
              width={"100%"}
              sx={{ py: 1 }}
            >
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() =>
                  DeleteTaskDialog.handleOpen({
                    id: task?._id,
                  })
                }
                startIcon={
                  <SvgIcon>
                    <Delete />
                  </SvgIcon>
                }
              >
                Delete Task
              </Button>
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
        <Box
          sx={{ px: 3, my: 1 }}
          display={"flex"}
          gap={2}
          alignItems={"center"}
        >
          <InputLabel id="label-select" sx={{ width: 100 }}>
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
                borderRadius: 1,
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

        <Divider />

        <Grid container sx={{ p: 0 }}>
          <Grid container md={8} xs={12} sx={{ p: 2 }}>
            <Stack direction={"column"} spacing={2} width={"100%"}>
              <Grid xs={12}>
                <Typography color="text.secondary" variant="caption">
                  Description
                </Typography>
              </Grid>
              <Grid xs={12} sx={{ height: "250px" }}>
                <Box
                  sx={{
                    ...customToolbarStyles,
                    ".ql-container": {
                      borderColor: theme.palette.divider,
                    },
                    height: "90%",
                  }}
                >
                  <ReactQuill
                    value={formik.values.description}
                    style={{
                      height: "80%",
                    }}
                    onChange={(value) => {
                      console.log("hitting raect quill");
                      formik.setFieldValue("description", value);
                      setIsFormBeingChanged(true);
                    }}
                  />
                </Box>
              </Grid>

              <Grid xs={12}>
                <Typography color="text.secondary" variant="caption">
                  Attachments
                </Typography>
              </Grid>
              <Grid xs={12}>
                <Stack
                  alignItems="start"
                  direction="column"
                  flexWrap="wrap"
                  spacing={1}
                >
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <IconButton
                      component="label"
                      htmlFor="account-settings-upload-image"
                    >
                      <SvgIcon fontSize="medium">
                        {/* <PlusIcon /> */}
                        <AttachFile />
                      </SvgIcon>

                      <input
                        hidden
                        type="file"
                        accept="*"
                        id="account-settings-upload-image"
                        onChange={handleFileChange}
                      />
                    </IconButton>
                    <Typography fontSize={14}>Add Attachments</Typography>
                  </Stack>

                  <Stack direction="row" width="100%" flexWrap="wrap">
                    {formik.values.attachments.map((attachment, index) => (
                      <div
                        key={attachment.url}
                        style={{
                          position: "relative",
                          marginRight: (index + 1) % 8 !== 0 ? "5px" : "0",
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
                                  backgroundColor: "transparent",
                                }}
                                variant="rounded"
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  cursor: "pointer",
                                  height: "100%",
                                  backgroundColor: "rgba(0, 0, 0, 0.4)",
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
                              {attachment.type.startsWith("video/") ? (
                                <VideoFileIcon sx={{ fontSize: 50 }} />
                              ) : attachment.type.startsWith("audio/") ? (
                                <AudioFileIcon sx={{ fontSize: 50 }} />
                              ) : (
                                <Description sx={{ fontSize: 50 }} />
                              )}

                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: "rgba(0, 0, 0, 0.4)",
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
            </Stack>
          </Grid>
          <Grid
            container
            md={4}
            xs={12}
            sx={(theme) => ({
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
              p: 2,
            })}
          >
            <Stack
              direction={"column"}
              spacing={2}
              width={"100%"}
              justifyContent={"space-between"}
            >
              <Stack direction={"column"} spacing={1}>
                <Grid xs={12}>
                  <Typography color="text.secondary" variant="caption">
                    Created by
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  {task?.owner && (
                    <Tooltip title={task?.owner.full_name} arrow>
                      <Avatar src={task?.owner.avatar || undefined} />
                    </Tooltip>
                  )}
                </Grid>

                <Grid xs={12}>
                  <Typography color="text.secondary" variant="caption">
                    Assigned to
                  </Typography>
                  <SelectMultipleUsers
                    employees={boardMembers}
                    inputSize="small"
                    formikUsers={formik.values.assignedTo.map(
                      (item: any) => item._id
                    )}
                    setFieldValue={(value: any) => {
                      setIsFormBeingChanged(true);
                      formik.setFieldValue("assignedTo", value);
                    }}
                  />
                </Grid>

                <Grid xs={12}>
                  <Typography color="text.secondary" variant="caption">
                    Due date
                  </Typography>
                  <MobileDateTimePicker
                    sx={{
                      width: "100%",
                    }}
                    value={formik.values.dueDate}
                    onChange={(date: Date | null) => {
                      setIsFormBeingChanged(true);
                      formik.setFieldValue("dueDate", date || new Date()); // Ensure a Date value is set
                    }}
                    slotProps={{
                      textField: {
                        size: "small", // Set the input size to small
                        fullWidth: true, // Make the input take full width
                        sx: {
                          height: 50,
                          ".css-10vtu9u-MuiInputBase-input-MuiFilledInput-input":
                            {
                              pt: "12px",
                              pb: "12px",
                            },
                          ".css-dqma4l-MuiInputBase-input-MuiFilledInput-input":
                            {
                              pt: "12px",
                              pb: "12px",
                            },
                        },
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

                <Grid xs={12}>
                  <Typography color="text.secondary" variant="caption">
                    Priority
                  </Typography>

                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    select
                    value={formik.values.priority} // Assuming single label selection for simplicity
                    onChange={(event) => {
                      setIsFormBeingChanged(true);
                      formik.setFieldValue("priority", event.target.value); // Replace array with selected value
                    }}
                  >
                    {Priorities.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Stack>

              <Grid xs={12}>
                <Stack
                  direction={"row"}
                  justifyContent={"flex-end"}
                  spacing={2}
                  alignItems={"flex-end"}
                  height={"100%"}
                >
                  <Button onClick={handleAttemptClose} variant="outlined">
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
                </Stack>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </form>

      {DeleteTaskDialog.open && (
        <ConfirmationModal
          modal={DeleteTaskDialog.open}
          onCancel={DeleteTaskDialog.handleClose}
          onConfirm={handleDelete}
          content={{
            type: "Delete",
            text: "Are you sure you want to delete the Task ?",
          }}
        />
      )}
    </Dialog>
  );
};
