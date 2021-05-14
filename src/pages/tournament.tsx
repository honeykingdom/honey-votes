import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "components/Layout";
import Tournament from "features/tournament/Tournament";

const getInitialMovies = () => {
  if (typeof window === "undefined") return [];

  const params = new URLSearchParams(window.location.search);

  return params.get("movies")?.split(";") || [];
};

const TournamentPage = () => {
  const router = useRouter();
  const [initialMovies] = useState<string[]>(getInitialMovies);

  useEffect(() => {
    if (!router.query.movies) return;

    router.push("/tournament");
  }, []);

  return (
    <>
      <Head>
        <title>HoneyVotes - Фильмовый турнир</title>
      </Head>
      <Layout>
        <Tournament initialMovies={initialMovies} />
      </Layout>
    </>
  );
};

export default TournamentPage;
