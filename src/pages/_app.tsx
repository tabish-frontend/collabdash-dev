// Remove if simplebar is not used
import "simplebar-react/dist/simplebar.min.css";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import type { EmotionCache } from "@emotion/react";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Toaster, SplashScreen } from "src/components/shared";
import { SettingsConsumer, SettingsProvider } from "src/contexts/settings";
import { useNprogress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import { Provider } from "react-redux";
import { AuthConsumer, AuthProvider } from "src/contexts/auth";
import { store } from "src/store";
import { WorkSpaceProvider } from "src/contexts/workSpace";
import { usePushNotifications } from "src/hooks";
const clientSideEmotionCache = createEmotionCache();

export interface CustomAppProps extends AppProps {
  Component: NextPage;
  emotionCache?: EmotionCache;
}

const CustomApp = (props: CustomAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNprogress();
  usePushNotifications();
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{process.env.NEXT_PUBLIC_COMPANY_NAME}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <AuthConsumer>
            {(auth) => (
              <SettingsProvider>
                <SettingsConsumer>
                  {(settings) => {
                    const theme = createTheme({
                      colorPreset: settings.colorPreset,
                      paletteMode: settings.paletteMode,
                      responsiveFontSizes: settings.responsiveFontSizes,
                    });

                    // Prevent guards from redirecting
                    const showSlashScreen = !auth.isInitialized;

                    return (
                      <Provider store={store}>
                        <ThemeProvider theme={theme}>
                          <CssBaseline />
                          {showSlashScreen ? (
                            <SplashScreen />
                          ) : (
                            <WorkSpaceProvider>
                              {getLayout(<Component {...pageProps} />)}
                            </WorkSpaceProvider>
                          )}
                          <Toaster />
                        </ThemeProvider>
                      </Provider>
                    );
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            )}
          </AuthConsumer>
        </AuthProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default CustomApp;
