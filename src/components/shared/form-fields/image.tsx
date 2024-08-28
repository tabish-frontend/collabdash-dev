import React, {
  useState,
  ChangeEvent,
  useEffect,
  FC,
  ElementType,
} from "react";
import {
  Stack,
  SvgIcon,
  Typography,
  Box,
  Avatar,
  ButtonProps,
  styled,
  Button,
} from "@mui/material";
import Camera01Icon from "@untitled-ui/icons-react/build/esm/Camera01";
import { alpha } from "@mui/system/colorManipulator";
import { useAuth } from "src/hooks/use-auth";
import { ImageAvatar, ImageCrop } from "src/components/shared";

const ImgStyled = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(3.25),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)<
  ButtonProps & { component?: ElementType; htmlFor?: string }
>(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

interface ImageFieldProps {
  formikImage: string;
}

export const ImageField: FC<ImageFieldProps> = ({ formikImage }) => {
  const [photoURL, setPhotoURL] = useState(formikImage);

  const [modal, setModal] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setPhotoURL(URL.createObjectURL(selectedFile));

      setModal(true);
    } else {
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ImgStyled
          src={formikImage || "/images/avatars/1.png"}
          alt="Profile Pic"
        />
        <Box>
          <ButtonStyled
            component="label"
            variant="contained"
            htmlFor="account-settings-upload-image"
          >
            Upload New Photo
            <input
              hidden
              type="file"
              accept="image/png, image/jpeg"
              id="account-settings-upload-image"
              onChange={handleFileChange}
            />
          </ButtonStyled>
        </Box>
      </Box>

      <ImageCrop
        modal={modal}
        photoURL={photoURL}
        setPhotoURL={setPhotoURL}
        setOpenCrop={setModal}
        onCancel={() => setModal(false)}
      />
    </>
  );
};
