// ** React Imports

// ** MUI Imports
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";

// ** Types Imports
import { Employee } from "src/types";
import { Box, CardActions, Stack, SvgIcon } from "@mui/material";
import { Cake, Cellphone, Email, MapMarker, Pencil } from "mdi-material-ui";
import { formatDob } from "src/utils/helpers";
import { useState } from "react";
// import { UpdateEmployeeModal } from 'src/components/modules/dashboard/employees/update-modal'
import { ImageAvatar } from "../image-avatar";
import { UpdateEmployeeModal } from "src/components/modules/dashboard/employees/update-modal";

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [theme.breakpoints.up("md")]: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export const EmployeeDetails = ({
  employeeData,
  UpdateEmployee,
}: {
  employeeData: Employee | undefined;
  UpdateEmployee: (values: Employee) => void;
}) => {
  const [updateModal, setUpdateModal] = useState(false);

  return (
    <>
      <Card sx={{ position: "relative" }}>
        <Box sx={{ position: "absolute", top: 20, right: 15 }}>
          <SvgIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setUpdateModal(true)}
          >
            <Pencil />
          </SvgIcon>
        </Box>
        <Grid container spacing={6}>
          <StyledGrid item md={4} xs={12}>
            <CardContent>
              <ImageAvatar
                path={employeeData?.avatar || ""}
                alt="user image"
                width={137}
                height={137}
              />
              <Typography
                variant="subtitle1"
                fontWeight={500}
                sx={{ my: 2, textAlign: "center" }}
              >
                {employeeData?.username}
              </Typography>
            </CardContent>
          </StyledGrid>
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              paddingLeft: [
                "1.5rem !important",
                "1.5rem !important",
                "0 !important",
              ],
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                {employeeData?.full_name}
              </Typography>
              <Typography variant="subtitle1" color="Highlight">
                {employeeData?.department}
              </Typography>
              <Typography variant="body2" textTransform={"capitalize"}>
                {employeeData?.designation}
              </Typography>
              <Typography variant="body2" sx={{ mt: 3 }}>
                {employeeData?.bio ||
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur saepe, quasi unde illo eum placeat harum vitae eos sapiente possimus quam assumenda quia"}
              </Typography>
            </CardContent>
            <CardActions>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2}>
                    <Cellphone fontSize="small" />
                    <Typography variant="subtitle2">
                      {employeeData?.mobile}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2}>
                    <Email fontSize="small" />
                    <Typography variant="subtitle2">
                      {employeeData?.email}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2}>
                    <Cake fontSize="small" />
                    <Typography variant="subtitle2">
                      {employeeData?.dob &&
                        formatDob(new Date(employeeData?.dob))}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2}>
                    <MapMarker fontSize="small" />
                    <Typography
                      variant="subtitle2"
                      textTransform={"capitalize"}
                    >
                      {employeeData?.country}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </CardActions>
          </Grid>
        </Grid>
      </Card>

      {updateModal && (
        <UpdateEmployeeModal
          employeeValues={{
            designation: employeeData?.designation || "",
            account_status: employeeData?.account_status || "",
            username: employeeData?.username || "",
          }}
          modal={updateModal}
          onCancel={() => setUpdateModal(false)}
          onConfirm={async (values: Employee) => {
            await UpdateEmployee(values);
            setUpdateModal(false);
          }}
        />
      )}
    </>
  );
};
