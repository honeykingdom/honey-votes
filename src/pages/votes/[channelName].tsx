import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
import Head from "next/head";
import { useClient } from "react-supabase";
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
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import Layout from "components/Layout";

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

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
  // const router = useRouter();
  const client = useClient();

  const [winners, setWinners] = useState<any[]>([]);
  const [userVotes, setUserVotes] = useState<any[]>([]);
  const [channelVoting, setChannelVoting] = useState<any>();

  const channelName = process.env.NEXT_PUBLIC_CHANNEL;
  // const channelName = router.query.channelName as string;

  useEffect(() => {
    (async () => {
      const [userVotes, channelVoting] = await Promise.all([
        client.from("user_vote").select().match({ channelName }),
        client.from("channel_voting").select().match({ channelName }),
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

  if (!channelVoting) return <Layout />;

  return (
    <Layout>
      <Head>HoneyVotes - {channelVoting.channelName}</Head>
      <Typography sx={{ my: 2 }} variant="h3">
        {channelVoting.channelName}
      </Typography>
      <Typography variant="body2" sx={{ my: 2 }}>
        <strong>%название_игры</strong> - проголосовать. <br />
        <strong>!clearvotes</strong> - очистить все голоса (только владелец
        канала).
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

      <Button variant="contained" sx={{ mb: 2 }} onClick={getWinner}>
        Выбрать победителя
      </Button>

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

      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "50%" }}></TableCell>
              <TableCell>Ник</TableCell>
              <TableCell>Дата</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userVotes.map(({ content, userName, displayName, updatedAt }) => (
              <TableRow key={userName}>
                <TableCell>{content}</TableCell>
                <TableCell title={userName}>
                  {displayName || userName}
                </TableCell>
                <TableCell>{new Date(updatedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default Votes;
