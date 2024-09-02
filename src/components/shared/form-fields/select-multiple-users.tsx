import {
  Autocomplete,
  Avatar,
  Badge,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Employee } from "src/types";

interface SelectMultipleUsersProps {
  employees: any[];
  formikUsers: string[];
  setFieldValue: (value: any) => void;
  isRequired?: boolean;
  inputSize?: "small" | "medium";
}

export const SelectMultipleUsers: React.FC<SelectMultipleUsersProps> = ({
  employees,
  formikUsers,
  setFieldValue,
  isRequired = false,
  inputSize = "medium",
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (event: any) => {
    const selectedUser = event.target.checked ? employees : [];
    setFieldValue(selectedUser);
    setSelectAll(event.target.checked);
  };

  useEffect(() => {
    if (employees.length === formikUsers.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [employees.length, formikUsers]);

  return (
    <Autocomplete
      multiple
      options={employees}
      size={inputSize}
      value={employees.filter((employee) => formikUsers.includes(employee._id))}
      getOptionLabel={(option) => option.full_name}
      disableCloseOnSelect
      onChange={(event: any, value: any[]) => setFieldValue(value)}
      sx={{
        minWidth: "300px",
      }}
      componentsProps={{
        popper: {
          modifiers: [
            {
              name: "flip",
              enabled: false,
            },
          ],
        },
      }}
      ListboxProps={{
        style: {
          maxHeight: "200px",
        },
      }}
      renderTags={() => {
        const selectedUsers = employees.filter((employee) =>
          formikUsers.includes(employee._id)
        );
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingTop: 15,
              paddingLeft: 5,
            }}
          >
            {selectedUsers.length > 1 ? (
              <Badge
                color="info"
                badgeContent={`+${selectedUsers.length - 1}`}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <div style={{ paddingRight: "4px" }}>
                  <span style={{ fontSize: 16, marginRight: "8px" }}>
                    {selectedUsers[0].full_name.length > 15
                      ? `${selectedUsers[0].full_name.slice(0, 15)}...`
                      : selectedUsers[0].full_name}
                  </span>
                </div>
              </Badge>
            ) : (
              <span style={{ fontSize: 16, marginRight: "8px" }}>
                {selectedUsers[0]?.full_name}
              </span>
            )}
          </div>
        );
      }}
      renderOption={(props, option) => (
        <div key={option._id}>
          {option._id === employees[0]._id && (
            <MenuItem key={option._id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                }
                label="Select All"
              />
            </MenuItem>
          )}
          <MenuItem key={option._id} value={option} {...props}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              key={option._id}
            >
              <Checkbox checked={formikUsers.includes(option._id)} />
              <Avatar
                alt={option.full_name}
                src={option.avatar}
                sx={{ width: 28, height: 28 }}
              />
              <Typography>{option.full_name}</Typography>
            </Stack>
          </MenuItem>
        </div>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          required={isRequired}
          label="Users"
          name="users"
        />
      )}
    />
  );
};
