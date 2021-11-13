import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import PollIcon from "@mui/icons-material/Poll";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import Layout from "components/Layout";
import SEO from "../../next-seo.config";

const FEATURES = [
  {
    title: "Голосование на сайте",
    description:
      "Зрители добавляют фильмы, игры или свой текст в качестве вариантов. Можно ограничить только для сабов/фолловеров.",
    IconComponent: PollIcon,
  },
  {
    title: "Голосование в чате",
    description:
      "Зрители вводят свои варианты прямо в чате твича. Стример видит их на сайте и может выбрать победителя.",
    IconComponent: PollIcon,
  },
  {
    title: "Чатгол",
    description:
      "Голосование за или против пока не наберётся нужное количество голосов. <br /> Есть виджет для OBS.",
    IconComponent: ThumbsUpDownIcon,
  },
];

const Home = () => {
  return (
    <Layout>
      <Box my={4} mb={8} alignContent="center">
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontSize: { xs: "3rem", sm: "6rem" } }}
        >
          {SEO.title}
        </Typography>
        <Typography
          variant="h2"
          component="p"
          gutterBottom
          align="center"
          color="textSecondary"
          sx={{
            maxWidth: 820,
            margin: "0 auto",
            fontSize: { xs: "2rem", sm: "3.75rem" },
          }}
        >
          {SEO.description}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {FEATURES.map(({ title, description, IconComponent }, i) => (
          <Grid key={i} item lg={4} sx={{ width: "100%" }}>
            <Card>
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconComponent sx={{ mr: 2, fontSize: 40 }} /> {title}
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  color="text.secondary"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default Home;
