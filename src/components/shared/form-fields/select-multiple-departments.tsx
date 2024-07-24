import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import { DepartmentNames } from "src/constants/departments";

interface SelectMultipleDepartmentsProps {
  departments: string[];
  handleChange: any;
}

export const SelectMultipleDepartments: React.FC<
  SelectMultipleDepartmentsProps
> = ({ departments, handleChange }) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSelectedDepartments = event.target.checked ? DepartmentNames : [];
    setSelectAll(event.target.checked);
    handleChange(event, newSelectedDepartments);
  };

  useEffect(() => {
    setSelectAll(departments.length === DepartmentNames.length);
  }, [departments]);

  return (
    <Autocomplete
      multiple
      options={DepartmentNames}
      value={departments}
      getOptionLabel={(option) => option}
      disableCloseOnSelect
      onChange={handleChange}
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
      renderOption={(props, option) => (
        <div key={option}>
          {option === DepartmentNames[0] && (
            <MenuItem>
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
          <MenuItem
            value={option}
            sx={{ justifyContent: "space-between" }}
            {...props}
          >
            <Checkbox checked={departments.indexOf(option) > -1} />
            <ListItemText primary={option} />
          </MenuItem>
        </div>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Select Department" />
      )}
    />
  );
};
