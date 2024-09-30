import { MenuItem, Skeleton, TextField } from "@mui/material";

interface TimeZoneFieldProps {
  handleBlur: <T = string>(e: T) => void;
  setFieldValue: (e: any) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
  name: string;
  is_disable: boolean;
  value: string;
  TimeZones: any[] | undefined;
}

export const TimeZoneField: React.FC<TimeZoneFieldProps> = ({
  handleBlur,
  setFieldValue,
  formikTouched,
  formikError,
  name,
  is_disable,
  value,
  TimeZones,
}) => {
  return (
    <TextField
      fullWidth
      required
      label="Time Zone"
      name={name}
      select
      disabled={is_disable}
      onBlur={handleBlur}
      value={value}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
      onChange={(e: any) => {
        if (TimeZones) {
          const selectedTimeZone = TimeZones.find(
            (option: { gmtOffsetName: any }) =>
              option.gmtOffsetName === e.target.value
          );
          if (selectedTimeZone) {
            const { tzName, gmtOffsetName } = selectedTimeZone;
            setFieldValue({
              name: `${tzName} ${gmtOffsetName}`,
              value: gmtOffsetName,
            });
          }
        }
      }}
    >
      {TimeZones?.map((option) => (
        <MenuItem key={option.gmtOffsetName} value={option.gmtOffsetName}>
          {option.tzName}
        </MenuItem>
      ))}
    </TextField>
  );
};
