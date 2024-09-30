import { useState, type FC, type ReactNode } from "react";
import PropTypes from "prop-types";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles/createTheme";
import { styled } from "@mui/material/styles";
import type { NavColor } from "src/types/settings";

import type { Section } from "../config";
import { MobileNav } from "../mobile-nav";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { useMobileNav } from "./use-mobile-nav";
import { useRouter } from "next/router";
import { paths } from "src/constants/paths";
import { usePushNotifications } from "src/hooks";

const SIDE_NAV_WIDTH = 240;

const VerticalLayoutRoot = styled("div")<{ isMeetingRoom: boolean }>(
  ({ theme, isMeetingRoom }) => ({
    display: "flex",
    flex: "1 1 auto",
    maxWidth: "100%",
    [theme.breakpoints.up("lg")]: {
      paddingLeft: isMeetingRoom ? 0 : SIDE_NAV_WIDTH,
    },
  })
);

const VerticalLayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

interface VerticalLayoutProps {
  children?: ReactNode;
  navColor?: NavColor;
  sections?: Section[];
}

export const VerticalLayout: FC<VerticalLayoutProps> = (props) => {
  const { children, sections, navColor } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const mobileNav = useMobileNav();

  usePushNotifications();

  const isMeetingRoom =
    router.pathname.startsWith(paths.meetings) &&
    router.pathname.length > paths.meetings.length;

  return (
    <>
      {!isMeetingRoom && <TopNav onMobileNavOpen={mobileNav.handleOpen} />}
      {lgUp && !isMeetingRoom && (
        <SideNav color={navColor} sections={sections} />
      )}
      {(!lgUp || isMeetingRoom) && (
        <MobileNav
          color={navColor}
          onClose={mobileNav.handleClose}
          open={mobileNav.open}
          sections={sections}
        />
      )}
      <VerticalLayoutRoot isMeetingRoom={isMeetingRoom}>
        <VerticalLayoutContainer>{children}</VerticalLayoutContainer>
      </VerticalLayoutRoot>
    </>
  );
};

VerticalLayout.propTypes = {
  children: PropTypes.node,
  navColor: PropTypes.oneOf<NavColor>(["blend-in", "discrete", "evident"]),
  sections: PropTypes.array,
};
