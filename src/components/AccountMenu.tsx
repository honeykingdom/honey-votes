// https://mui.com/components/menus/#account-menu
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch } from 'app/hooks';
import getMainMenuLinks from 'utils/getMainMenuLinks';
import TwitchIcon from 'icons/twitch.svg';
import { useMeQuery } from 'features/api/apiSlice';
import { AUTH_URL, LS_REDIRECT_PATH } from 'features/auth/authConstants';
import { clearTokens } from 'features/auth/authSlice';
import { removeTokens } from 'features/auth/tokensStorage';
import PurpleButton from './PurpleButton';

const AccountMenu = () => {
  const [t] = useTranslation(['common', 'voting', 'chatVoting', 'chatGoal']);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = !!anchorEl;

  const me = useMeQuery();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSignIn = () => {
    localStorage.setItem(LS_REDIRECT_PATH, window.location.pathname);
  };

  const handleSignOut = () => {
    dispatch(clearTokens());
    me.refetch();

    removeTokens();
  };

  if (me.isLoading || me.isUninitialized) return null;

  const hasUser = me.data && !me.isError;

  if (!hasUser)
    return (
      <Tooltip title={t('signInTwitch') as string}>
        <PurpleButton
          variant="contained"
          startIcon={<TwitchIcon style={{ width: 16 }} />}
          href={AUTH_URL}
          onClick={handleSignIn}
        >
          {t('signIn')}
        </PurpleButton>
      </Tooltip>
    );

  return (
    <>
      <Button
        startIcon={
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={me.data.avatarUrl}
            alt={me.data.displayName}
          >
            {me.data.displayName.slice(0, 1)}
          </Avatar>
        }
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: 'none',
          color: 'inherit',
          fontWeight: 'bold',
          fontSize: 'inherit',
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {me.data.displayName}
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {getMainMenuLinks(me.data).map(({ name, href, IconComponent }) => (
          <Link key={href} href={href} passHref>
            <MenuItem component="a">
              <ListItemIcon>
                <IconComponent fontSize="small" />
              </ListItemIcon>
              {t('title', { ns: name })}
            </MenuItem>
          </Link>
        ))}

        <Divider />

        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {t('signOut')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
