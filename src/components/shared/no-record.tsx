import { Stack, Typography } from "@mui/material";
import Image from "next/image";

export const NoRecordData = ({
  title,
  text,
  imageSize,
  fontSize,
  cardHeight,
}: {
  title?: boolean;
  text?: string;
  imageSize?: number;
  fontSize?: string;
  cardHeight?: string;
}) => {
  return (
    <Stack
      sx={{
        p: 3,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: cardHeight,
      }}
    >
      <Image
        alt="Not found"
        src="/assets/errors/error-404.svg"
        width={imageSize}
        height={0}
        style={{ height: "auto" }}
      />
      {title && (
        <Typography
          align="center"
          sx={{
            mt: 2,
            fontSize: { fontSize },
            fontWeight: "bold",
          }}
        >
          {text}
        </Typography>
      )}
    </Stack>
  );
};
