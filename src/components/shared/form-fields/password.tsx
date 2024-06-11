import React, { useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

interface PasswordFieldProps {
  formikErrors?: string | undefined
  formikTouched?: boolean | undefined
  handleBlur?: <T = string>(e: T) => void
  handleChange: <T = string>(e: T) => void
  label: string
  name: string
  values: string
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  formikErrors,
  formikTouched,
  handleBlur,
  handleChange,
  label,
  name,
  values
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)

  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      value={values}
      error={!!(formikTouched && formikErrors)}
      fullWidth
      required
      helperText={formikTouched && formikErrors}
      label={label}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword}>
              {showPassword ? <EyeOutline /> : <EyeOffOutline />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}
