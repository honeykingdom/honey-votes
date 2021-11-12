import { useMemo } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import PersonIcon from "@mui/icons-material/Person";
import { useAppDispatch, useAppSelector } from "app/hooks";
import getMainMenuLinks from "utils/getMainMenuLinks";
import { useMeQuery } from "features/api/apiSlice";
import { hideSnackbar } from "features/snackbar/snackbarSlice";
import { useAuthRedirect } from "features/auth/useAuthRedirect";
import AccountMenu from "./AccountMenu";

const Layout = ({ children }: any) => {
  const dispatch = useAppDispatch();

  const me = useMeQuery();
  const snackbarState = useAppSelector((state) => state.snackbar);

  useAuthRedirect();

  const handleSnackbarClose = useMemo(
    () => (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === "clickaway") return;

      dispatch(hideSnackbar());
    },
    []
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
              {getMainMenuLinks(me.data.login).map(({ label, href }) => (
                <Link key={href} href={href} passHref>
                  <Button color="inherit">{label}</Button>
                </Link>
              ))}
            </>
          )}

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

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarState.variant}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout;
