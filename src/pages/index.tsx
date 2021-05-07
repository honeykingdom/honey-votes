import { useEffect } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  useTheme,
} from "@material-ui/core";
import Layout from "components/Layout";

const streamers = [
  {
    id: "60796327",
    name: "Lasqa",
    nickname: "lasqa",
    image:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/lasqa-profile_image-49dc25f1e724dbd6-300x300.jpeg",
  },
];

const StreamerCard = ({ nickname, image, name }: typeof streamers[0]) => {
  const theme = useTheme();

  return (
    <Card>
      <NextLink href={`votes/${nickname}`}>
        <CardActionArea component="a">
          <CardContent
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <CardMedia
              image={image}
              title={name}
              component="img"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
              }}
            />
            <div style={{ paddingLeft: theme.spacing(2) }}>
              <Typography component="h4" variant="h4">
                {name}
              </Typography>
              <Typography
                component="span"
                variant="subtitle1"
                color="textSecondary"
              >
                twitch.tv/{nickname}
              </Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </NextLink>
    </Card>
  );
};

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/votes/lasqa");
  }, []);

  return <Layout />;

  return (
    <Layout>
      <Box my={4} alignContent="center">
        <Typography variant="h1" component="h1" gutterBottom align="center">
          HoneyVotes
        </Typography>
        <Typography
          variant="h2"
          component="p"
          gutterBottom
          align="center"
          color="textSecondary"
          style={{ maxWidth: 820, margin: "0 auto" }}
        >
          Kappa Keepo 4Head
        </Typography>
      </Box>

      <Typography variant="h3" component="h3" gutterBottom align="center">
        Votes
      </Typography>

      <Grid container spacing={4}>
        {streamers.slice(0, 12).map((streamer, key) => (
          <Grid item xs={4} key={key}>
            <StreamerCard {...streamer} />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default Home;
