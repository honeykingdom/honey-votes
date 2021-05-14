import * as R from "ramda";
import { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useClient, useSubscription } from "react-supabase";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  colors,
  Tooltip,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import InfoIcon from "@material-ui/icons/Info";
import Layout from "components/Layout";
import getRandomInt from "utils/getRandomInt";

const VoteIcon = ({ canVote }: { canVote: boolean }) =>
  canVote ? (
    <CheckIcon
      style={{
        verticalAlign: "middle",
        color: colors.green[500],
        fontSize: 24,
      }}
    />
  ) : (
    <CloseIcon
      style={{ verticalAlign: "middle", color: colors.red[500], fontSize: 24 }}
    />
  );

const Votes = () => {
  const router = useRouter();
  const supabase = useClient();

  const [winners, setWinners] = useState<any[]>([]);
  const [userVotes, setUserVotes] = useState<any[]>([]);
  const [channelVoting, setChannelVoting] = useState<any>();

  const channelName = process.env.NEXT_PUBLIC_CHANNEL;
  // const channelName = router.query.channelName as string;

  const table = `user_vote:channelName=eq.${channelName}`;

  useSubscription((payload) => setUserVotes((prev) => [...prev, payload.new]), {
    event: "INSERT",
    table,
  });

  useSubscription(
    (payload) =>
      setUserVotes((prev) =>
        prev.map((userVote) =>
          userVote.userName === payload.new.userName ? payload.new : userVote
        )
      ),
    { event: "UPDATE", table }
  );

  useSubscription(
    (payload) =>
      setUserVotes((prev) =>
        prev.filter((userVote) => userVote.userName !== payload.old.userName)
      ),
    { event: "DELETE", table }
  );

  useEffect(() => {
    (async () => {
      const [userVotes, channelVoting] = await Promise.all([
        supabase.from("user_vote").select().match({ channelName }),
        supabase.from("channel_voting").select().match({ channelName }),
      ]);

      setUserVotes(userVotes.data || []);
      setChannelVoting(channelVoting.data?.[0]);
    })();
  }, []);

  const getWinner = () => {
    if (winners.length === userVotes.length) return;

    let randomIndex: number;

    while (true) {
      randomIndex = getRandomInt(0, userVotes.length);

      const userVote = userVotes[randomIndex];

      if (!winners.some((w) => w.userName === userVote.userName)) {
        setWinners((prev) => [...prev, { ...userVote }]);

        break;
      }
    }
  };

  const removeWinner = (userName: string) => () => {
    setWinners((prev) => prev.filter((w) => w.userName !== userName));
  };

  const createTournament = () => {
    router.push({
      pathname: "/tournament",
      query: { movies: winners.map(R.prop("content")).join(";") },
    });
  };

  if (!channelVoting) return <Layout />;

  return (
    <Layout>
      <Head>HoneyVotes - {channelVoting.channelName}</Head>
      <Typography sx={{ my: 2 }} variant="h3">
        {channelVoting.channelName}
        <Tooltip
          title={
            <>
              <em>%название_игры</em> - проголосовать. <br />
              <em>!clearvotes</em> - очистить все голоса (только модеры).
            </>
          }
        >
          <InfoIcon sx={{ ml: 2 }} />
        </Tooltip>
      </Typography>
      <Typography variant="body2" sx={{ my: 2 }}>
        Голосовать могут:{" "}
        <VoteIcon canVote={channelVoting.permissions.viewers} />
        Зрители, <VoteIcon canVote={channelVoting.permissions.subscribers} />
        Сабы, <VoteIcon canVote={channelVoting.permissions.vips} />
        Випы, <VoteIcon canVote={channelVoting.permissions.mods} />
        Модеры
      </Typography>

      <Typography sx={{ my: 2 }} variant="h4">
        Победители
      </Typography>

      <Button variant="contained" sx={{ mb: 2, mr: 2 }} onClick={getWinner}>
        Выбрать победителя
      </Button>

      <Tooltip title="Создать фильмовый турнир с победителями">
        <Button
          variant="contained"
          disabled={winners.length < 2}
          sx={{ mb: 2 }}
          onClick={createTournament}
        >
          Создать фильмовый турнир
        </Button>
      </Tooltip>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {winners.map(({ content, userName, displayName, updatedAt }) => (
              <TableRow key={userName}>
                <TableCell>{content}</TableCell>
                <TableCell>{displayName || userName}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" onClick={removeWinner(userName)}>
                    Убрать
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography sx={{ my: 2 }} variant="h4">
        Все голоса
      </Typography>

      <TableContainer sx={{ mb: 2 }} component={Paper}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "50%" }}></TableCell>
              <TableCell>Ник</TableCell>
              <TableCell>Дата</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {R.sort(R.descend(R.prop("updatedAt")), userVotes).map(
              ({ content, userName, displayName, updatedAt }) => (
                <TableRow key={userName}>
                  <TableCell>{content}</TableCell>
                  <TableCell title={userName}>
                    {displayName || userName}
                  </TableCell>
                  <TableCell>{new Date(updatedAt).toLocaleString()}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const voteChannels = process.env.NEXT_PUBLIC_CHANNEL.split(";");

  return {
    paths: voteChannels.map((channelName) => ({
      params: { channelName },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};

export default Votes;
