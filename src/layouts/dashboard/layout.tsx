import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";

import { useSettings } from "src/hooks/use-settings";
import { useSections } from "./config";
import { VerticalLayout } from "./vertical-layout";
import { AuthGuard } from "src/components";

interface LayoutProps {
  children?: ReactNode;
}

export const DashboardLayout: FC<LayoutProps> = (props) => {
  const settings = useSettings();
  const sections = useSections();

  const component = (
    <VerticalLayout
      sections={sections}
      navColor={settings.navColor}
      {...props}
    />
  );

  return <AuthGuard>{component}</AuthGuard>;
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
