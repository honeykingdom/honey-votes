import * as R from "ramda";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
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
  Tooltip,
  Box,
  Divider,
  Link,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import getRandomInt from "utils/getRandomInt";
import { AUTH_URL, LS_REDIRECT_PATH } from "utils/constants";
import {
  useClearChatVotingMutation,
  useCreateChatVotingMutation,
  useGetChatVotesQuery,
  useChatVotingQuery,
  useMeQuery,
  useMeRolesQuery,
  useUpdateChatVotingMutation,
  useUserQuery,
} from "features/api/apiSlice";
import { ChatVote, ChatVoting, TwitchUserType } from "features/api/types";
import Breadcrumbs from "components/Breadcrumbs";
import TwitchNickName from "components/TwitchNickName";
import TwitchChatMessage from "components/TwitchChatMessage";
import Restrictions from "../components/Restrictions";
import { OnChatVotingChange } from "../types";

const SUB_MONTHS = [
  { value: 0, title: "Subscriber" },
  { value: 3, title: "3-Month Subscriber" },
  { value: 6, title: "6-Month Subscriber" },
  { value: 12, title: "1-Year Subscriber" },
  { value: 24, title: "2-Year Subscriber" },
  { value: 36, title: "3-Year Subscriber" },
  { value: 48, title: "4-Year Subscriber" },
  { value: 54, title: "4.5-Year Subscriber" },
  { value: 60, title: "5-Year Subscriber" },
  { value: 66, title: "5.5-Year Subscriber" },
  { value: 72, title: "6-Year Subscriber" },
  { value: 78, title: "6.5-Year Subscriber" },
  { value: 84, title: "7-Year Subscriber" },
  { value: 90, title: "7.5-Year Subscriber" },
  { value: 96, title: "8-Year Subscriber" },
];

const DEFAULT_CHAT_VOTING_RESTRICTIONS: ChatVoting["restrictions"] = {
  [TwitchUserType.Viewer]: false,
  [TwitchUserType.SubTier1]: true,
  [TwitchUserType.SubTier2]: true,
  [TwitchUserType.SubTier3]: true,
  [TwitchUserType.Mod]: true,
  [TwitchUserType.Vip]: true,
  subMonthsRequired: 0,
};

/** Replaces `voteCommand` at the start of the message with spaces */
const normalizeTwitchChatMessage = (message: string, voteCommand = "") => {
  return message
    .replace(voteCommand, Array(voteCommand).fill(" ").join(""))
    .trim();
};

const ChatVotesPage = () => {
  const router = useRouter();
  const [winners, setWinners] = useState<ChatVote[]>([]);

  const channelName = (router.query.channelName as string)?.toLowerCase();

  const channel = useUserQuery({ login: channelName }, { skip: !channelName });
  const me = useMeQuery();
  const meRoles = useMeRolesQuery(
    { login: channelName },
    { skip: !channelName }
  );
  const chatVoting = useChatVotingQuery(channel.data?.id, {
    skip: !channel.data,
  });
  const chatVotes = useGetChatVotesQuery(channel.data?.id, {
    skip: !channel.data,
  });

  const [createChatVoting, createChatVotingResult] =
    useCreateChatVotingMutation();
  const [updateChatVoting, updateChatVotingResult] =
    useUpdateChatVotingMutation();
  const [clearChatVoting, clearChatVotingResult] = useClearChatVotingMutation();

  const getWinner = () => {
    if (winners.length === chatVotes.data.length) return;

    let randomIndex: number;

    while (true) {
      randomIndex = getRandomInt(0, chatVotes.data.length);

      const userVote = chatVotes.data[randomIndex];

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

  const handleChatVotingChange: OnChatVotingChange = (body) => {
    if (chatVoting.data) {
      updateChatVoting({ chatVotingId: channel.data.id, body });
    } else {
      createChatVoting({ ...body, broadcasterId: channel.data.id });
    }
  };

  const toggleListening = () => {
    handleChatVotingChange({ listening: !chatVoting.data?.listening });
  };

  const handleSignIn = () => {
    localStorage.setItem(LS_REDIRECT_PATH, window.location.pathname);
  };

  const isEditFormDisabled =
    createChatVotingResult.isLoading ||
    updateChatVotingResult.isLoading ||
    clearChatVotingResult.isLoading;

  const canManage =
    !me.isError &&
    !meRoles.isError &&
    (me.data?.id === channel.data?.id || meRoles.data?.isEditor);

  const renderedChatVotes = useMemo(
    () => R.sort(R.descend(R.prop("updatedAt")), chatVotes.data || []),
    [chatVotes.data]
  );

  const renderSignInMessage = () => (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Голосование для канала <strong>{channelName}</strong> ещё не создано.
      </Typography>
      <Typography variant="body1">
        Если вы владелец канала <strong>twitch.tv/{channelName}</strong>,
        пожалуйста,{" "}
        {me.isSuccess ? (
          "войдите"
        ) : (
          <Link href={AUTH_URL} onClick={handleSignIn}>
            войдите
          </Link>
        )}
        , чтобы создать голосование.
      </Typography>
    </>
  );

  const renderChatVoting = () => (
    <>
      <Typography variant="body2" component="div" sx={{ my: 1 }}>
        {canManage && (
          <Button
            variant="contained"
            color={chatVoting.data?.listening ? "success" : "error"}
            startIcon={
              chatVoting.data?.listening ? <LockOpenIcon /> : <LockIcon />
            }
            disabled={isEditFormDisabled}
            onClick={toggleListening}
          >
            {chatVoting.data?.listening
              ? "Закрыть голосование"
              : "Открыть голосование"}
          </Button>
        )}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: 1 }}>Голосовать могут:</Box>
          <Restrictions
            restrictions={
              chatVoting.data?.restrictions || DEFAULT_CHAT_VOTING_RESTRICTIONS
            }
            canManage={canManage}
            disabled={isEditFormDisabled}
            onChange={handleChatVotingChange}
          />
        </Box>

        {/* <TableContainer sx={{ maxWidth: 640 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>
                  <code>%текст</code>
                </TableCell>
                <TableCell>проголосовать</TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <code>!clearvotes</code>
                </TableCell>
                <TableCell>
                  очистить все голоса (только владелец канала и редакторы)
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> */}
      </Typography>

      <Typography sx={{ my: 2 }} component="div" variant="h5">
        Победители
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          disabled={!chatVotes.data || !chatVotes.data.length}
          onClick={getWinner}
        >
          Выбрать победителя
        </Button>

        <Tooltip title="Создать фильмовый турнир с победителями">
          <Box display="inline-block">
            <Button
              variant="contained"
              disabled={winners.length < 2}
              onClick={createTournament}
            >
              Создать турнир
            </Button>
          </Box>
        </Tooltip>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {winners.map(({ content, userName, tags, updatedAt }, i) => (
              <TableRow key={userName}>
                <TableCell sx={{ width: 16 }}>{i + 1}.</TableCell>
                <TableCell>
                  <TwitchChatMessage
                    message={normalizeTwitchChatMessage(
                      content,
                      chatVoting.data?.commands.vote
                    )}
                    tags={tags}
                  />
                </TableCell>
                <TableCell title={userName}>
                  <TwitchNickName userName={userName} tags={tags} />
                </TableCell>
                <TableCell align="right" sx={{ py: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={removeWinner(userName)}
                  >
                    Убрать
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        sx={{ my: 2, display: "flex", alignItems: "center" }}
        component="div"
        variant="h5"
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="inherit" sx={{ mr: 1 }}>
            Все голоса ({renderedChatVotes.length}){" "}
          </Typography>
          <Tooltip
            title={
              chatVoting.data?.listening
                ? "Голосование открыто"
                : "Голосование закрыто"
            }
          >
            {chatVoting.data?.listening ? (
              <LockOpenIcon />
            ) : (
              <LockIcon color="error" />
            )}
          </Tooltip>
        </Box>
        {canManage && (
          <Box sx={{ marginLeft: "auto" }}>
            <Button
              variant="text"
              size="small"
              startIcon={<ClearAllIcon />}
              disabled={isEditFormDisabled || !renderedChatVotes.length}
              onClick={() => clearChatVoting(channel.data.id)}
            >
              Очистить голоса
            </Button>
          </Box>
        )}
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
            {renderedChatVotes.map(({ content, userName, tags, updatedAt }) => (
              <TableRow key={userName}>
                <TableCell>
                  <TwitchChatMessage
                    message={normalizeTwitchChatMessage(
                      content,
                      chatVoting.data?.commands.vote
                    )}
                    tags={tags}
                  />
                </TableCell>
                <TableCell title={userName}>
                  <TwitchNickName userName={userName} tags={tags} />
                </TableCell>
                <TableCell>{new Date(updatedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  return (
    <>
      <Head>
        <title>
          {channel.data?.displayName || channelName} - Голосование в чате
        </title>
      </Head>

      <Typography variant="h4" component="div" sx={{ mb: 2 }}>
        Голосование в чате
        <Tooltip
          title={
            <>
              <code>%текст</code> - проголосовать. <br />
              <code>!clearvotes</code> - очистить все голоса (только владелец
              канала и редакторы).
            </>
          }
        >
          <InfoIcon sx={{ ml: 2 }} />
        </Tooltip>
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Breadcrumbs
          items={[
            {
              title: channel.data?.displayName || channelName,
              href: `/${channel.data?.login || channelName}`,
            },
            { title: "Голосование в чате" },
          ]}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {chatVoting.isSuccess && renderChatVoting()}
      {channel.isError && renderSignInMessage()}
    </>
  );
};

export default ChatVotesPage;
