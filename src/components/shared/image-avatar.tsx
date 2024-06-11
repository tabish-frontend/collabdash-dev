import { Avatar, SvgIcon, styled } from "@mui/material";
import Image from "next/image";
import User01Icon from "@untitled-ui/icons-react/build/esm/User01";

const StyledAvatar = styled(Avatar)(({}: any) => ({}));

interface ImageAvatarProps {
  path: string;
  alt: string;
  width: number;
  height: number;
}

export const ImageAvatar: React.FC<ImageAvatarProps> = ({
  path,
  alt,
  width,
  height,
}) => {
  return (
    <StyledAvatar sx={{ width, height }} alt="image">
      {path ? (
        <Image src={path} alt={alt} width={width} height={height} />
      ) : (
        <SvgIcon>
          <User01Icon />
        </SvgIcon>
      )}
    </StyledAvatar>
  );
};
