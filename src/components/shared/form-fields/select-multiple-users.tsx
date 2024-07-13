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
  formikUsers: Employee[];
  setFieldValue: (value: any) => void;
  isRequired?: boolean;
}

export const SelectMultipleUsers: React.FC<SelectMultipleUsersProps> = ({
  employees,
  formikUsers,
  setFieldValue,
  isRequired = false,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleAutocompleteChange = (event: any, value: any[]) => {
    setFieldValue(value.map((v) => v._id));
  };

  const getSelectedUsers = () => {
    return employees.filter((employee) => formikUsers.includes(employee._id));
  };

  const handleSelectAllChange = (event: any) => {
    const selectedIds = event.target.checked
      ? employees.map((user) => user._id)
      : [];
    setFieldValue(selectedIds);
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
      value={getSelectedUsers()}
      getOptionLabel={(option) => option.full_name}
      disableCloseOnSelect
      onChange={handleAutocompleteChange}
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
        const selectedUsers = getSelectedUsers();
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
