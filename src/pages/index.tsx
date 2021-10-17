// import { GetStaticProps } from "next";
// import fetch from "node-fetch";
import { Box, Typography, Grid } from "@mui/material";
import Layout from "components/Layout";
// import { TwitchUsersResponse } from "features/twitch-api/twitch";
// import { Streamer } from "features/api/types";
// import StreamerCard from "components/StreamerCard";
import SEO from "../../next-seo.config";

// type Props = {
//   streamers: Streamer[];
// };

const Home = () => {
  return (
    <Layout>
      <Box my={4} alignContent="center">
        <Typography variant="h1" component="h1" gutterBottom align="center">
          {SEO.title}
        </Typography>
        <Typography
          variant="h2"
          component="p"
          gutterBottom
          align="center"
          color="textSecondary"
          style={{ maxWidth: 820, margin: "0 auto" }}
        >
          {SEO.description}
        </Typography>
      </Box>

      {/* <Typography variant="h3" component="h3" gutterBottom align="center">
        Votes
      </Typography> */}

      {/* <Grid container spacing={4}>
        {streamers.slice(0, 12).map((streamer, key) => (
          <Grid item xs={4} key={key}>
            <StreamerCard {...streamer} />
          </Grid>
        ))}
      </Grid> */}
    </Layout>
  );
};

// export const getStaticProps: GetStaticProps<Props> = async () => {
//   const channels = process.env.NEXT_PUBLIC_CHANNELS.split(";");
//   const query = channels
//     .map((channel) => `login=${channel}`)
//     .reverse()
//     .join("&");

//   const response = await fetch(`https://api.twitch.tv/helix/users?${query}`, {
//     headers: {
//       "Client-ID": process.env.TWITCH_CLIENT_ID,
//       Authorization: `Bearer ${process.env.TWITCH_TOKEN}`,
//     },
//   });
//   const data: TwitchUsersResponse = (await response.json()) as any;

//   return {
//     props: {
//       streamers: data.data.map(
//         ({
//           id,
//           login,
//           display_name: displayName,
//           profile_image_url: profileImageUrl,
//         }) => ({
//           id,
//           login,
//           displayName,
//           profileImageUrl,
//         })
//       ),
//     },
//   };
// };

export default Home;
