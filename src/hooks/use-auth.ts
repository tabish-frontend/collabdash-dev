import { useContext } from "react";

import type { AuthContextType as JwtAuthContextType } from "src/contexts/auth";
import { AuthContext } from "src/contexts/auth";

type AuthContextType = JwtAuthContextType;

export const useAuth = <T = AuthContextType>() => useContext(AuthContext) as T;
