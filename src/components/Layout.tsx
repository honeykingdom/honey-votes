import { AppBar, Toolbar, Typography, Container } from "@material-ui/core";

const Layout = ({ children }: any) => {
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ marginRight: 16 }}>
            HoneyVotes
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
