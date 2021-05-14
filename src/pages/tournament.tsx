import Head from "next/head";
import Layout from "components/Layout";
import Tournament from "features/tournament/Tournament";

const TournamentPage = () => {
  return (
    <>
      <Head>
        <title>HoneyVotes - Фильмовый турнир</title>
      </Head>
      <Layout>
        <Tournament />
      </Layout>
    </>
  );
};

export default TournamentPage;
