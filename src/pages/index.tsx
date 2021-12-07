import { useTranslation } from 'react-i18next';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import PollIcon from '@mui/icons-material/Poll';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import Layout from 'components/Layout';

const FEATURE_ICONS = {
  voting: PollIcon,
  chatVoting: PollIcon,
  chatGoal: ThumbsUpDownIcon,
};

type Feature = {
  name: keyof typeof FEATURE_ICONS;
  title: string;
  description: string;
};

const Home = () => {
  const [t] = useTranslation('home');

  const features = t('features', { returnObjects: true }) as Feature[];

  return (
    <Layout>
      <Box my={4} mb={8} alignContent="center">
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontSize: { xs: '3rem', sm: '6rem' } }}
        >
          {t('title')}
        </Typography>
        <Typography
          variant="h2"
          component="p"
          gutterBottom
          align="center"
          color="textSecondary"
          sx={{
            maxWidth: 820,
            margin: '0 auto',
            fontSize: { xs: '2rem', sm: '3.75rem' },
          }}
        >
          {t('subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {features.map(({ name, title, description }) => {
          const Icon = FEATURE_ICONS[name];

          return (
            <Grid key={name} item lg={4} sx={{ width: '100%' }}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Icon sx={{ mr: 2, fontSize: 40 }} /> {title}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    color="text.secondary"
                  >
                    {description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Layout>
  );
};

export default Home;
