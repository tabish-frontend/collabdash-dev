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
import { WorkspaceModal } from "src/components/shared";
import { useSettings } from "src/hooks";

const SIDE_NAV_WIDTH = 240;

const VerticalLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

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
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const mobileNav = useMobileNav();

  const setting = useSettings();
  return (
    <>
      <TopNav onMobileNavOpen={mobileNav.handleOpen} />
      {lgUp && <SideNav color={navColor} sections={sections} />}
      {!lgUp && (
        <MobileNav
          color={navColor}
          onClose={mobileNav.handleClose}
          open={mobileNav.open}
          sections={sections}
        />
      )}
      <VerticalLayoutRoot>
        <VerticalLayoutContainer>
          {children}

          {setting.workspaceeModal && (
            <WorkspaceModal
              modal={setting.workspaceeModal}
              onCancel={() => {
                setting.handleUpdateWorkspaceState(false);
              }}
            />
          )}
        </VerticalLayoutContainer>
      </VerticalLayoutRoot>
    </>
  );
};

VerticalLayout.propTypes = {
  children: PropTypes.node,
  navColor: PropTypes.oneOf<NavColor>(["blend-in", "discrete", "evident"]),
  sections: PropTypes.array,
};
