// ** MUI Imports
import { styled } from "@mui/material/styles";

import Grid from "@mui/material/Grid";

// ** Types Imports
import { Employee } from "src/types";
import {
  Box,
  Stack,
  SvgIcon,
  Card,
  CardContent,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Account,
  AccountCircle,
  ArrowCollapseDown,
  ArrowCollapseUp,
  Bank,
  Cake,
  CardAccountDetails,
  Cellphone,
  CreditCard,
  Domain,
  Email,
  MapMarker,
  MapMarkerAlert,
  Pencil,
  School,
} from "mdi-material-ui";
import { formatDob } from "src/utils/helpers";
import { useState } from "react";
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

  const [extandable, setExtandable] = useState(false);

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
        <Grid container spacing={1}>
          <StyledGrid item md={3} xs={12}>
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
          <Grid item md={9} xs={12}>
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

              <Grid container spacing={2} mt={2}>
                <Grid item sm={12} md={6}>
                  <Box display={"flex"} flexDirection={"row"} gap={1}>
                    <Cake fontSize="small" />
                    <Typography variant="subtitle2">
                      {employeeData?.dob &&
                        formatDob(new Date(employeeData?.dob))}
                    </Typography>
                  </Box>

                  <Box display={"flex"} flexDirection={"row"} gap={1} mt={1}>
                    <Cellphone fontSize="small" />
                    <Typography variant="subtitle2">
                      {employeeData?.mobile}
                    </Typography>
                  </Box>

                  {extandable && (
                    <>
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={1}
                        mt={1}
                      >
                        <CardAccountDetails fontSize="small" />
                        <Typography variant="subtitle2">
                          {employeeData?.national_identity_number}
                        </Typography>
                      </Box>

                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={1}
                        mt={1}
                      >
                        <Domain fontSize="small" />
                        <Typography variant="subtitle2">
                          {employeeData?.company}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Grid>

                <Grid item sm={12} md={6}>
                  <Box display={"flex"} flexDirection={"row"} gap={1}>
                    <Account fontSize="small" />
                    <Typography
                      variant="subtitle2"
                      textTransform={"capitalize"}
                    >
                      {employeeData?.gender}
                    </Typography>
                  </Box>

                  <Box display={"flex"} flexDirection={"row"} gap={1} mt={1}>
                    <Email fontSize="small" />
                    <Typography variant="subtitle2" noWrap>
                      {employeeData?.email}
                    </Typography>
                  </Box>

                  {extandable && (
                    <>
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={1}
                        mt={1}
                      >
                        <School fontSize="small" />
                        <Typography variant="subtitle2">
                          {employeeData?.qualification}
                        </Typography>
                      </Box>

                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={1}
                        mt={1}
                      >
                        <MapMarker fontSize="small" />
                        <Typography variant="subtitle2">
                          {employeeData?.country}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Grid>
              </Grid>

              {extandable && (
                <>
                  <Typography
                    variant="subtitle1"
                    mt={2}
                    fontWeight={600}
                    color={"Highlight"}
                  >
                    Bank Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item sm={12} md={6}>
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={1}
                        mt={1}
                      >
                        <Bank fontSize="small" />
                        <Typography variant="subtitle2">
                          {employeeData?.bank_details?.bank_name}
                        </Typography>
                      </Box>

                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={1}
                        mt={1}
                      >
                        <AccountCircle fontSize="small" />
                        <Typography variant="subtitle2">
                          {employeeData?.bank_details?.account_holder_name}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item sm={12} md={6}>
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={1}
                        mt={1}
                      >
                        <MapMarkerAlert fontSize="small" />
                        <Typography variant="subtitle2">
                          {employeeData?.bank_details?.bank_name}
                        </Typography>
                      </Box>

                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={1}
                        mt={1}
                      >
                        <CreditCard fontSize="small" />
                        <Typography variant="subtitle2">
                          {employeeData?.bank_details?.account_number}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}

              <Stack direction={"row"} justifyContent={"flex-end"}>
                <Tooltip title={extandable ? "Collapse" : "Extend"} arrow>
                  <span>
                    <IconButton onClick={() => setExtandable(!extandable)}>
                      {extandable ? <ArrowCollapseUp /> : <ArrowCollapseDown />}
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {updateModal && (
        <UpdateEmployeeModal
          employeeValues={{
            designation: employeeData?.designation || "",
            account_status: employeeData?.account_status || "",
            username: employeeData?.username || "",
            email: employeeData?.email || "",
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
