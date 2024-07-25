import { createContext } from "react";

import type { Settings } from "src/types/settings";

export const defaultSettings: Settings = {
  colorPreset: "blue",
  layout: "vertical",
  navColor: "evident",
  paletteMode: "light",
  responsiveFontSizes: true,
  stretch: true,
};

export interface State extends Settings {
  openDrawer: boolean;
  isInitialized: boolean;
}

export const initialState: State = {
  ...defaultSettings,
  isInitialized: false,
  openDrawer: false,
};

export interface SettingsContextType extends State {
  handleUpdate: (settings: Settings) => void;
  isCustom: boolean;
  handleUpdateWorkspaceState: (value: boolean) => void;
  workspaceeModal: boolean;
}

export const SettingsContext = createContext<SettingsContextType>({
  ...initialState,
  handleUpdate: () => {},
  isCustom: false,
  handleUpdateWorkspaceState: () => {},
  workspaceeModal: false,
});

export const RoleContext = createContext<{ role: string }>({
  role: "",
});
