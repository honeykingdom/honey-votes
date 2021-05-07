import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";

const Layout = ({ children }: any) => {
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ marginRight: 16 }}>
            HoneyVotes
          </Typography>

          <Box sx={{ ml: "auto" }}>
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
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
