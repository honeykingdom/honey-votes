import { useEffect, useRef, useState } from 'react';
import { Chat, PrivateMessage } from 'twitch-js';
import { useSnackbar } from 'notistack';
import getErrorMessage from 'features/api/utils/getErrorMessage';
import { Permissions } from './tournamentTypes';

let chat: Chat | null = null;

const VOTE_NUMBERS = Array.from({ length: 10 }, (_, i) => `${i + 1}`);

const getVoteNumber = (
  message: PrivateMessage,
  moviesCount: number,
): number | null => {
  if (!VOTE_NUMBERS.includes(message.message)) return null;

  const number = Number.parseInt(message.message, 10);

  if (number > moviesCount) return null;

  return number;
};

const canVote = (message: PrivateMessage, permissions: Permissions) => {
  if (permissions.viewer) return true;
  if (permissions.vip && 'vip' in message.tags.badges) return true;
  if (permissions.mod && 'moderator' in message.tags.badges) return true;
  if (permissions.sub && 'subscriber' in message.tags.badges) return true;

  return false;
};

const useChatVoting = (
  channel: string,
  moviesCount: number,
  permissions: Permissions,
) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isActive, setIsActive] = useState(false);
  const userVotesRef = useRef<Record<number, number>>({});
  const [votes, setVotes] = useState<number[]>([]);

  const permissionsRef = useRef<Permissions>(permissions);
  permissionsRef.current = permissions;

  const moviesCountRef = useRef<number>(moviesCount);
  moviesCountRef.current = moviesCount;

  useEffect(() => {
    if (isActive && !chat && channel) {
      chat = new Chat({ log: { level: 'silent' } });

      return () => {
        if (chat) {
          chat.disconnect();
        }
      };
    }
  }, [isActive, channel]);

  useEffect(() => {
    if (!isActive || !chat || !channel) return;

    (async () => {
      try {
        await chat.connect();

        chat.join(channel);
      } catch (e) {
        enqueueSnackbar(
          getErrorMessage(e) || 'Не удалось подключиться к чату',
          { variant: 'error' },
        );
        setIsActive(false);
      }
    })();

    const handleMessage = (message: PrivateMessage) => {
      const n = getVoteNumber(message, moviesCountRef.current);

      if (n === null || !canVote(message, permissionsRef.current)) return;

      const oldVote = userVotesRef.current[message.tags.userId];

      if (oldVote && n === oldVote) return;

      userVotesRef.current[message.tags.userId] = n;

      const initialArray = Array(moviesCountRef.current).fill(0);

      setVotes(
        Object.values(userVotesRef.current).reduce((acc, value) => {
          acc[value - 1] += 1;

          return acc;
        }, initialArray),
      );
    };

    // @ts-expect-error
    chat.on('PRIVMSG', handleMessage);

    return () => {
      if (chat) {
        // @ts-expect-error
        chat.off('PRIVMSG', handleMessage);
      }
    };
  }, [isActive, channel, permissionsRef, moviesCountRef, userVotesRef]);

  useEffect(() => {
    const result = Array.from({ length: moviesCount }, () => 0);

    setVotes(result);
    userVotesRef.current = {};
  }, [moviesCount]);

  const startVoting = () => setIsActive(true);
  const stopVoting = () => setIsActive(false);

  return {
    isActive,
    startVoting,
    stopVoting,
    votes,
    votesCount: Object.keys(userVotesRef.current).length,
  };
};

export default useChatVoting;
