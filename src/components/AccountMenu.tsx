// https://mui.com/components/menus/#account-menu
import { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  Avatar,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PollIcon from "@mui/icons-material/Poll";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMeQuery } from "features/api/apiSlice";
import {
  AUTH_URL,
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  LS_REDIRECT_PATH,
} from "utils/constants";
import TwitchIcon from "icons/twitch.svg";
import PurpleButton from "./PurpleButton";

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;

  const me = useMeQuery();

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSignIn = () => {
    localStorage.setItem(LS_REDIRECT_PATH, window.location.pathname);
  };

  const handleSignOut = () => {
    Cookies.remove(COOKIE_ACCESS_TOKEN);
    Cookies.remove(COOKIE_REFRESH_TOKEN);
    // TODO: set empty data instead of refetching
    me.refetch();
  };

  if (me.isLoading || me.isUninitialized) return null;

  const hasUser = me.data && !me.isError;

  if (!hasUser)
    return (
      <Tooltip title="Войти через твич">
        <PurpleButton
          variant="contained"
          startIcon={<TwitchIcon style={{ width: 16 }} />}
          href={AUTH_URL}
          onClick={handleSignIn}
        >
          Войти
        </PurpleButton>
      </Tooltip>
    );

  return (
    <>
      <Button
        startIcon={
          <Avatar sx={{ width: 32, height: 32 }} src={me.data.avatarUrl}>
            {me.data.displayName.slice(0, 1)}
          </Avatar>
        }
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: "none",
          color: "inherit",
          fontWeight: "bold",
          fontSize: "inherit",
        }}
        onClick={handleClick}
      >
        {me.data.displayName}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* <Link href={`/${me.data.login}/voting`} passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <PollIcon fontSize="small" />
            </ListItemIcon>
            Голосование
          </MenuItem>
        </Link> */}

        <Link href={`/${me.data.login}/chat-voting`} passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <PollIcon fontSize="small" />
            </ListItemIcon>
            Голосование в чате
          </MenuItem>
        </Link>

        <Divider />

        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
