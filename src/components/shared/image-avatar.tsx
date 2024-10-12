import { Avatar, Box, Skeleton, SvgIcon, styled } from "@mui/material";
import Image from "next/image";
import User01Icon from "@untitled-ui/icons-react/build/esm/User01";

interface ImageAvatarProps {
  path: string;
  alt: string;
  width: number;
  height: number;
  isLoading?: boolean;
}

export const ImageAvatar: React.FC<ImageAvatarProps> = ({
  path,
  alt,
  width,
  height,
  isLoading = false,
}) => {
  return (
    <>
      {path ? (
        <Image
          src={path}
          alt={alt}
          width={width}
          height={height}
          style={{ borderRadius: "50%" }}
        />
      ) : (
        <Avatar sx={{ width, height }}>
          <SvgIcon>
            <User01Icon />
          </SvgIcon>
        </Avatar>
      )}
    </>
  );
};
