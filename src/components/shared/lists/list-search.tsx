import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles/createTheme";
import { useDebouncedCallback } from "use-debounce";
import {
  Divider,
  IconButton,
  MenuItem,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ClearIcon from "@mui/icons-material/Clear";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import dayjs from "dayjs";

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

function generateCustomArray(currentYear: number) {
  const startYear = 2023;
  const numberOfYearsToAdd = 2;
  const endYear = currentYear + numberOfYearsToAdd;
  const customArray = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index
  );
  if (!customArray.includes(currentYear)) {
    customArray.push(currentYear);
  }
  customArray.sort((a, b) => a - b);
  return customArray;
}

const currentYear = dayjs().year();
const yearOptions = generateCustomArray(currentYear);
interface SortOption {
  label: string;
  value: string;
}

const classTypeOptions: SortOption[] = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Regular",
    value: "regular",
  },
  {
    label: "Demo",
    value: "demo",
  },
];

const sortOptions: SortOption[] = [
  {
    label: "A to Z",
    value: "full_name",
  },
  {
    label: "Z to A",
    value: "-full_name",
  },
  {
    label: "Newest",
    value: "-createdAt",
  },
  {
    label: "Oldest",
    value: "createdAt",
  },
];

interface TabOption {
  label: string;
  value: string;
}

interface CustomerListSearchProps {
  isSort?: boolean;
  isView?: boolean;
  onSort?: (sort: string) => void;
  isSearch?: boolean;
  onSearch?: (search: string) => void;
  isStatus?: boolean;
  statusValues?: TabOption[];
  currentStatus?: string;
  onChangeStatus?: (event: ChangeEvent<any>, newValue: string) => void;
  isOptions?: boolean;
  currentOption?: string | string[];
  onChangeOption?: (event: { target: { value: any } }) => void;
  isLoading?: boolean;
  currentView?: string;
  onChangeView?: (
    event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => void;

  isCurrency?: boolean;
  setCurrency?: string;
  currencyChange?: (event: { target: { value: any } }) => void;
  clearCurrencyFilter?: () => void;

  isMonthFilter?: boolean;
  setMonth?: string;
  monchChange?: (event: { target: { value: any } }) => void;
  clearMonthFilter?: () => void;

  isYearFilter?: boolean;
  setYear?: number;
  yearChange?: (event: { target: { value: any } }) => void;

  isCreated?: boolean;
}

export const ListSearch: FC<CustomerListSearchProps> = ({
  isSort = false,
  isView = true,
  onSort,
  isSearch = true,
  onSearch,
  isStatus = false,
  statusValues = [
    {
      label: "Upcoming",
      value: "upcoming",
    },
    {
      label: "Completed",
      value: "completed",
    },
  ],
  currentStatus,
  onChangeStatus,
  isOptions = false,
  currentOption,
  onChangeOption,
  isLoading,
  currentView,
  onChangeView,

  isCurrency = false,
  setCurrency,
  currencyChange,
  clearCurrencyFilter,

  isMonthFilter = false,
  setMonth,
  monchChange,
  clearMonthFilter,

  isYearFilter = false,
  setYear,
  yearChange,

  isCreated = false,
}) => {
  const debouncedSearch = useDebouncedCallback(onSearch ?? (() => {}), 500);
  const isMediumUp = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );

  const activeStyle = {
    color: "white",
    backgroundColor: "#EC5E2D",
  };

  return (
    <Stack>
      {isSearch && (
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          sx={{ p: 2 }}
          gap={3}
        >
          <Box component="form" sx={{ flexGrow: 1 }}>
            <OutlinedInput
              defaultValue=""
              fullWidth
              onChange={(e) => {
                debouncedSearch(e.target.value.trim());
              }}
              placeholder="Search"
              startAdornment={
                <InputAdornment position="start">
                  <SvgIcon>
                    <SearchMdIcon />
                  </SvgIcon>
                </InputAdornment>
              }
            />
          </Box>
          {isSort && (
            <TextField
              style={{ minWidth: "170px" }}
              label="Sort By"
              name="sort"
              onChange={(e) => {
                onSort?.(e.target.value);
              }}
              select
              fullWidth={!isMediumUp}
              SelectProps={{ native: true }}
            >
              {sortOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </TextField>
          )}

          {isOptions && (
            <TextField
              style={{ minWidth: "200px" }}
              label="Class Type"
              value={currentOption}
              disabled={isLoading}
              onChange={onChangeOption}
              select
              fullWidth={!isMediumUp}
            >
              {classTypeOptions.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}

          {isMonthFilter && (
            <TextField
              style={{ minWidth: "200px" }}
              label="Select Month"
              value={setMonth}
              onChange={monchChange}
              InputProps={{
                endAdornment: isCreated && (
                  <InputAdornment position="start">
                    {setMonth && (
                      <IconButton onClick={clearMonthFilter} edge="start">
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              select
              fullWidth={!isMediumUp}
            >
              {monthOptions.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          )}
          {isYearFilter && (
            <TextField
              style={{ minWidth: "200px" }}
              label="Select Year"
              value={setYear}
              onChange={yearChange}
              select
              fullWidth={!isMediumUp}
            >
              {yearOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Stack>
      )}
      {isStatus && (
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack sx={{ width: "100%" }}>
            <Tabs
              indicatorColor="primary"
              onChange={onChangeStatus}
              scrollButtons="auto"
              sx={{ px: 3, py: 0.5 }}
              textColor="primary"
              value={currentStatus}
              variant="scrollable"
            >
              {statusValues.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  disabled={isLoading}
                />
              ))}
            </Tabs>
          </Stack>

          {isView && (
            <Stack pr={2}>
              <ToggleButtonGroup
                orientation="horizontal"
                value={currentView}
                exclusive
                onChange={onChangeView}
              >
                <Tooltip title="List View">
                  <ToggleButton
                    value="list"
                    aria-label="list"
                    style={currentView === "list" ? activeStyle : {}}
                  >
                    <ViewListIcon />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title="Calender View">
                  <ToggleButton
                    value="calender"
                    aria-label="module"
                    style={currentView === "calender" ? activeStyle : {}}
                  >
                    <ViewModuleIcon />
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
            </Stack>
          )}

          <Divider />
        </Stack>
      )}
    </Stack>
  );
};
