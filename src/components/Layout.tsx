import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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
import { useMeQuery } from "features/api/apiSlice";
import { LS_REDIRECT_PATH } from "utils/constants";
import AccountMenu from "./AccountMenu";

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
                <Button color="inherit">Голосование</Button>
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

            <AccountMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ pt: 2 }}>{children}</Container>
    </Box>
  );
};

export default Layout;
