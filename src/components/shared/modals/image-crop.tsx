import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Typography, Slider } from "@mui/material";
import { CropPortrait, Cancel } from "mdi-material-ui";
import { type FC, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg, { CropResult } from "src/utils/crop-image";
import { toast } from "react-toastify";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";

interface ImageCrop {
  onCancel: () => void;
  modal: boolean;
  photoURL: any;
  setOpenCrop: any;
  setPhotoURL: any;
}
export const ImageCrop: FC<ImageCrop> = ({
  onCancel,
  modal,
  photoURL,
  setOpenCrop,
  setPhotoURL,
}) => {
  const { updateCurrentUser } = useAuth<AuthContextType>();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const cropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const MAX_FILE_SIZE_MB = 1;

  const cropImage = async () => {
    try {
      const croppedImageResult: CropResult | null = await getCroppedImg(
        photoURL,
        croppedAreaPixels
      );

      if (croppedImageResult?.url) {
        setPhotoURL(croppedImageResult.url);
      }

      if (croppedImageResult?.file) {
        const { blob, name } = croppedImageResult.file;

        const fileSizeInMB = blob.size / (1024 * 1024);

        if (fileSizeInMB > MAX_FILE_SIZE_MB) {
          toast.error(
            `Image size exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB} MB`
          );

          return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("avatar", blob, name);

        await updateCurrentUser(formData);

        setIsLoading(false);
      }

      setOpenCrop(false);
    } catch (error) {
      setOpenCrop(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={modal} onClose={onCancel}>
      <Paper elevation={12}>
        <DialogContent
          dividers
          sx={{
            background: "#333",
            position: "relative",
            height: 400,
            width: "auto",
            minWidth: { sm: 500 },
            borderTop: "none",
          }}
        >
          <Cropper
            image={photoURL}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onZoomChange={setZoom}
            onCropChange={setCrop}
            onCropComplete={cropComplete}
          />
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", mx: 3, my: 2 }}>
          <Box sx={{ width: "100%", mb: 1 }}>
            <Box>
              <Typography>Zoom: {zoomPercent(zoom)}</Typography>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={zoomPercent}
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e, zoom) => setZoom(zoom as number)}
              />
            </Box>
          </Box>
        </DialogActions>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            mx: 3,
            my: 2,
          }}
        >
          <Stack spacing={2} direction={"row"} justifyContent={"flex-end"}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={onCancel}
              size="small"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<CropPortrait />}
              onClick={cropImage}
              size="small"
              disabled={isLoading}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Dialog>
  );
};

const zoomPercent = (value: any) => {
  return `${Math.round(value * 100)}%`;
};
