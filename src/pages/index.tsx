import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import Layout from "components/Layout";
import SEO from "../../next-seo.config";

const FEATURES = [
  {
    title: "Голосование в чате",
    description:
      "Зрители могут голосовать прямо в чате твича. <br /> Стример может видеть в реальном времени их голоса на сайте и выбрать победителя.",
  },
  {
    title: "Голосование на сайте",
    description:
      "Стример может создать голосование для зрителей с ограничением только для сабов/фолловеров. Пользователи смогут добавлять свои варианты и голосовать за них.",
  },
  {
    title: "Фильмы и игры",
    description:
      "Пользователи могут добавлять фильмы с сайта kinopoisk.ru или игры с сайта IGDB.com как варианты для голосования, либо ввести свой текст в качестве варианта.",
  },
];

const Home = () => {
  return (
    <Layout>
      <Box my={4} mb={8} alignContent="center">
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

      <Grid container spacing={2}>
        {FEATURES.map(({ title, description }, i) => (
          <Grid key={i} item md={4} sx={{ width: "100%" }}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {title}
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
