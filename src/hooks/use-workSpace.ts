import { useContext } from "react";

import { WorkSpaceContext } from "src/contexts/workSpace";

export const useWorkSpace = () => useContext(WorkSpaceContext);
