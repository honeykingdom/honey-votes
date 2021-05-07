import Head from "next/head";
import { AppProps, NextWebVitalsMetric } from "next/app";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import createCache from "@emotion/cache";
import { DefaultSeo } from "next-seo";
import { createClient } from "@supabase/supabase-js";
import { Provider as SupabaseProvider } from "react-supabase";
import defaultTheme from "theme";
import SEO from "../../next-seo.config";

export const cache = createCache({ key: "css", prepend: true });

const theme = createMuiTheme(defaultTheme);

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_HOST,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY
);

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <CacheProvider value={cache}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <SupabaseProvider value={client}>
          <DefaultSeo {...SEO} />
          <CssBaseline />
          <Component {...pageProps} />
        </SupabaseProvider>
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
