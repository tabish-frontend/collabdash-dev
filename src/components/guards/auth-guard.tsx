import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "next/router";
import { paths, roles } from "src/constants";
import { AuthContextType } from "src/contexts/auth";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: FC<AuthGuardProps> = (props) => {
  const { user } = useAuth<AuthContextType>();

  const { children } = props;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [checked, setChecked] = useState<boolean>(false);

  const check = useCallback(() => {
    if (!isAuthenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();
      const href = paths.auth.login + `?${searchParams}`;
      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router, user?.role]);

  useEffect(() => {
    check();
  }, [router]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
