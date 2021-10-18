import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import PersonIcon from "@mui/icons-material/Person";
import TwitchIcon from "icons/twitch.svg";
import { useMeQuery } from "features/api/apiSlice";
import {
  AUTH_URL,
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  LS_REDIRECT_PATH,
} from "utils/constants";
import PurpleButton from "./PurpleButton";

const Layout = ({ children }: any) => {
  const me = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    const redirectPath = localStorage.getItem(LS_REDIRECT_PATH);

    if (redirectPath) {
      localStorage.removeItem(LS_REDIRECT_PATH);
      router.replace(redirectPath);
    }
  }, []);

  const handleSignIn = () => {
    localStorage.setItem(LS_REDIRECT_PATH, window.location.pathname);
  };

  const handleSignOut = () => {
    Cookies.remove(COOKIE_ACCESS_TOKEN);
    Cookies.remove(COOKIE_REFRESH_TOKEN);
    // TODO: set empty data instead of refetching
    me.refetch();
  };

  const signInButton = (
    <PurpleButton variant="contained" href={AUTH_URL} onClick={handleSignIn}>
      <TwitchIcon style={{ width: 16 }} />
      &nbsp; Войти
    </PurpleButton>
  );

  const signOutButton = (
    <PurpleButton variant="contained" onClick={handleSignOut}>
      Выйти
    </PurpleButton>
  );

  const hasUser = me.data && !me.isError;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" passHref>
            <Typography
              variant="h6"
              component="a"
              style={{
                marginRight: 16,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              HoneyVotes
            </Typography>
          </Link>

          {hasUser && (
            <>
              {/* <Link href={`/${me.data.login}/voting/`} passHref>
                <Button color="inherit">Голосование на сайте</Button>
              </Link> */}
              <Link href={`/${me.data.login}/chat-votes`} passHref>
                <Button color="inherit">Голосование в чате</Button>
              </Link>
            </>
          )}
          <Link href="/tournament" passHref>
            <Button color="inherit">Турнир</Button>
          </Link>

          <Box sx={{ ml: "auto" }}>
            <Tooltip title="Автор - DmitryScaletta">
              <IconButton
                color="inherit"
                sx={{ mr: 1 }}
                href="//github.com/DmitryScaletta"
                target="_blank"
                rel="noreferrer noopener"
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Репозиторий на GitHub">
              <IconButton
                color="inherit"
                sx={{ mr: 1 }}
                href="//github.com/honeykingdom/honey-votes"
                target="_blank"
                rel="noreferrer noopener"
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {!me.isLoading && (
            <>
              {hasUser ? (
                <>
                  <Typography
                    variant="body1"
                    color="inherit"
                    sx={{ display: "flex", alignItems: "center", mr: 1, p: 1 }}
                  >
                    <TwitchIcon style={{ height: 24, marginRight: 8 }} />
                    &nbsp;
                    <strong>{me.data.displayName}</strong>
                  </Typography>
                  <Box sx={{ my: 1 }}>{signOutButton}</Box>
                </>
              ) : (
                <Tooltip title="Войти через твич">{signInButton}</Tooltip>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ pt: 2 }}>{children}</Container>
    </Box>
  );
};

export default Layout;
