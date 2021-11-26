import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import PersonIcon from '@mui/icons-material/Person';
import getMainMenuLinks from 'utils/getMainMenuLinks';
import { useMeQuery } from 'features/api/apiSlice';
import { useAuthRedirect } from 'features/auth/useAuthRedirect';
import AccountMenu from './AccountMenu';

const Layout = ({ children }: any) => {
  const me = useMeQuery();

  useAuthRedirect();

  const isMenuVisible = me.data && !me.isError;

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
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              HoneyVotes
            </Typography>
          </Link>

          {isMenuVisible && (
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {getMainMenuLinks(me.data).map(({ label, href }) => (
                <Link key={href} href={href} passHref>
                  <Button color="inherit">{label}</Button>
                </Link>
              ))}
            </Box>
          )}

          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Автор - DmitryScaletta">
              <IconButton
                color="inherit"
                sx={{ display: { xs: 'none', sm: 'inline-flex' }, mr: 1 }}
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
                sx={{ display: { xs: 'none', sm: 'inline-flex' }, mr: 1 }}
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
