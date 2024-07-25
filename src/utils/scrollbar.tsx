import SimpleBar from "simplebar-react";
import { styled } from "@mui/material/styles";
import { forwardRef } from "react";

const StyledScrollbar = styled(SimpleBar)``;

export const Scrollbar = forwardRef<any, any>((props, ref) => (
  <StyledScrollbar {...props} ref={ref} />
));
