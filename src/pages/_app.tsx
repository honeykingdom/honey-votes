import * as React from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { DefaultSeo } from "next-seo";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { Provider as ReduxProvider } from "react-redux";
import createEmotionCache from "utils/createEmotionCache";
import theme from "app/theme";
import store from "app/store";
import SEO from "../../next-seo.config";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <ReduxProvider store={store}>
          <DefaultSeo {...SEO} />
          <CssBaseline />
          <Component {...pageProps} />
        </ReduxProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

// export const reportWebVitals = ({
//   id,
//   name,
//   label,
//   value,
// }: NextWebVitalsMetric) => {
//   window.gtag("event", name, {
//     event_category:
//       label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
//     value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
//     event_label: id, // id unique to current page load
//     non_interaction: true, // avoids affecting bounce rate.
//   });
// };

export default App;
