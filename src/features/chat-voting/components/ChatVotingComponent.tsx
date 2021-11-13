import { useState } from "react";
import { useRouter } from "next/router";
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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import getRandomInt from "utils/getRandomInt";
import useChannelLogin from "hooks/useChannelLogin";
import TwitchNickName from "components/TwitchNickName";
import TwitchChatMessage from "components/TwitchChatMessage";
import ConfirmationDialog from "components/ConfirmationDialog";
import { ChatVote } from "features/api/apiTypes";
import apiSchema from "features/api/apiSchema.json";
import {
  useClearChatVotingMutation,
  useCreateChatVotingMutation,
  useChatVotesQuery,
  useChatVotingQuery,
  useMeQuery,
  useMeRolesQuery,
  useUpdateChatVotingMutation,
  useUserQuery,
  chatVotesSelectors,
} from "features/api/apiSlice";
import Permissions from "./Permissions";
import { OnChatVotingChange } from "../types";

/** Replaces `voteCommand` at the start of the message with spaces */
const normalizeTwitchChatMessage = (message: string, voteCommand = "") => {
  return message
    .replace(voteCommand, Array(voteCommand).fill(" ").join(""))
    .trim();
};

const ChatVotingComponent = () => {
  const router = useRouter();
  const [winners, setWinners] = useState<ChatVote[]>([]);
  const [isClearVotesDialogOpen, setIsClearVotesDialogOpen] = useState(false);

  const login = useChannelLogin();
  const channel = useUserQuery({ login }, { skip: !login });
  const me = useMeQuery();
  const meRoles = useMeRolesQuery({ login }, { skip: !login });
  const chatVoting = useChatVotingQuery(channel.data?.id, {
    skip: !channel.data,
  });
  const chatVotes = useChatVotesQuery(channel.data?.id, {
    skip: !channel.data,
  });

  const [createChatVoting, createChatVotingResult] =
    useCreateChatVotingMutation();
  const [updateChatVoting, updateChatVotingResult] =
    useUpdateChatVotingMutation();
  const [clearChatVoting, clearChatVotingResult] = useClearChatVotingMutation();

  if (chatVoting.isUninitialized || chatVoting.isLoading) return null;

  const getWinner = () => {
    if (winners.length === chatVotes.data.ids.length) return;

    let randomIndex: number;

    while (true) {
      randomIndex = getRandomInt(0, chatVotes.data.ids.length);

      const randomId = chatVotes.data.ids[randomIndex];
      const userVote = chatVotes.data.entities[randomId];

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
    const voteCommandLength = chatVoting.data?.commands.vote.length || 0;
    const movies = winners
      .map((v) => v.content.slice(voteCommandLength))
      .join(";");

    router.push({
      pathname: "/tournament",
      query: { movies },
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

  const isEditFormDisabled =
    createChatVotingResult.isLoading ||
    updateChatVotingResult.isLoading ||
    clearChatVotingResult.isLoading ||
    chatVoting.isFetching;

  const canManage =
    !me.isError &&
    !meRoles.isError &&
    (me.data?.id === channel.data?.id || meRoles.data?.editor);

  const renderedChatVotes = chatVotes.data
    ? chatVotesSelectors.selectAll(chatVotes.data)
    : [];

  return (
    <Box>
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

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box sx={{ mr: 1 }}>Голосовать могут:</Box>
          <Permissions
            permissions={
              chatVoting.data?.permissions ||
              apiSchema.ChatVoting.permissions.default
            }
            canManage={canManage}
            disabled={isEditFormDisabled}
            onChange={handleChatVotingChange}
          />
        </Box>

        <Typography variant="inherit" color="text.secondary">
          <code>{chatVoting.data?.commands.vote || "%"}текст</code> –
          проголосовать
          <br />
          <code>{chatVoting.data?.commands.clearVotes || "!clearvotes"}</code> –
          очистить все голоса{" "}
          <Tooltip title="Только владелец канала и редакторы">
            <InfoIcon sx={{ verticalAlign: "middle", fontSize: "1rem" }} />
          </Tooltip>
        </Typography>
      </Typography>

      <Typography sx={{ my: 2 }} component="div" variant="h5">
        Победители
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          disabled={!chatVotes.data || !chatVotes.data?.ids.length}
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
                  <TwitchNickName
                    channelId={channel.data?.id}
                    userName={userName}
                    tags={tags}
                  />
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
            Все голоса ({chatVotes.data?.ids.length || 0}){" "}
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
              disabled={isEditFormDisabled || !chatVotes.data?.ids.length}
              onClick={() => setIsClearVotesDialogOpen(true)}
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
                  <TwitchNickName
                    channelId={channel.data?.id}
                    userName={userName}
                    tags={tags}
                  />
                </TableCell>
                <TableCell>{new Date(updatedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationDialog
        open={isClearVotesDialogOpen}
        title="Очистить голоса"
        description="Вы действительно хотите удалить все голоса?"
        handleClose={() => setIsClearVotesDialogOpen(false)}
        handleYes={() => clearChatVoting(channel.data.id)}
      />
    </Box>
  );
};

export default ChatVotingComponent;
