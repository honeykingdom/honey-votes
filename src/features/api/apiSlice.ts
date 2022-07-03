import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { RealtimeSubscription } from '@supabase/realtime-js';
import supabase from 'utils/supabase';
import apiQuery from './apiQuery';
import {
  API_BASE,
  API_BASE_POSTGREST,
  CHAT_GOAL_TABLE_NAME,
  CHAT_VOTE_TABLE_NAME,
  CHAT_VOTING_TABLE_NAME,
  USER_TABLE_NAME,
  VOTE_TABLE_NAME,
  VOTING_OPTION_TABLE_NAME,
  VOTING_TABLE_NAME,
} from './apiConstants';
import {
  CreateChatVotingDto,
  CreateVoteDto,
  CreateVotingDto,
  CreateVotingOptionDto,
  ChatVote,
  ChatVoting,
  UpdateChatVotingDto,
  UpdateVotingDto,
  User,
  UserRoles,
  Vote,
  Voting,
  VotingOption,
  DeleteVoteDto,
  ChatGoal,
  CreateChatGoalDto,
  UpdateChatGoalDto,
  IgdbGame,
} from './apiTypes';
import transformVotingOption from './utils/transformVotingOption';

type LoginOrId = { login: string; id?: never } | { login?: never; id: string };

// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#normalizing-data-with-createentityadapter
const votingOptionsAdapter = createEntityAdapter<VotingOption>();

export const votingOptionsSelectors = votingOptionsAdapter.getSelectors();

const votesAdapter = createEntityAdapter<Vote>({
  selectId: (vote) => vote.authorId,
});

export const votesSelectors = votesAdapter.getSelectors();

const chatVotesAdapter = createEntityAdapter<ChatVote>({
  selectId: (chatVote) => chatVote.userId,
  sortComparer: (a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
});

export const chatVotesSelectors = chatVotesAdapter.getSelectors();

export const api = createApi({
  reducerPath: 'api',
  baseQuery: apiQuery,
  tagTypes: ['Voting', 'VotingOption', 'Vote', 'ChatVoting', 'ChatVote'],
  endpoints: (builder) => ({
    me: builder.query<User, void>({
      query: () => ({
        url: `${API_BASE}/users/me`,
      }),
    }),
    meRoles: builder.query<UserRoles, LoginOrId>({
      query: (params) => ({
        url: `${API_BASE}/users/me/roles`,
        params,
      }),
    }),
    user: builder.query<User, LoginOrId>({
      query: (arg) => ({
        url: `${API_BASE_POSTGREST}/${USER_TABLE_NAME}`,
        params: {
          login: arg.login ? `eq.${arg.login}` : undefined,
          id: arg.id ? `eq.${arg.id}` : undefined,
        },
      }),
      transformResponse: (response: User[]) => response[0],
    }),

    votingList: builder.query<Voting[], string>({
      query: (channelId) => ({
        url: `${API_BASE_POSTGREST}/${VOTING_TABLE_NAME}`,
        params: { broadcasterId: `eq.${channelId}`, order: 'createdAt.desc' },
      }),
      providesTags: [{ type: 'Voting', id: 'LIST' }],
    }),
    voting: builder.query<Voting, number>({
      query: (votingId) => ({
        url: `${API_BASE_POSTGREST}/${VOTING_TABLE_NAME}`,
        params: { id: `eq.${votingId}` },
      }),
      transformResponse: (response: Voting[]) => response[0],
      // providesTags: (result, error, arg) => [{ type: 'Voting', id: arg }],
      onCacheEntryAdded: async (
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) => {
        let subscription: RealtimeSubscription | null = null;

        try {
          await cacheDataLoaded;

          subscription = supabase
            .from<Voting>(`${VOTING_TABLE_NAME}:id=eq.${arg}`)
            .on('*', (payload) =>
              updateCachedData((): any => {
                if (payload.eventType === 'INSERT') return payload.new;
                if (payload.eventType === 'UPDATE') return payload.new;
                if (payload.eventType === 'DELETE') return null;
              }),
            )
            .subscribe();
        } catch {}

        await cacheEntryRemoved;

        if (subscription) supabase.removeSubscription(subscription);
      },
    }),
    createVoting: builder.mutation<Voting, CreateVotingDto>({
      query: (body) => ({
        url: `${API_BASE}/voting`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Voting', id: 'LIST' }],
    }),
    updateVoting: builder.mutation<
      Voting,
      { votingId: number; body: UpdateVotingDto }
    >({
      query: ({ votingId, body }) => ({
        url: `${API_BASE}/voting/${votingId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Voting', id: 'LIST' },
        // { type: 'Voting', id: arg.votingId },
      ],
    }),
    deleteVoting: builder.mutation<void, number>({
      query: (votingId) => ({
        url: `${API_BASE}/voting/${votingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Voting', id: 'LIST' },
        // { type: 'Voting', id: arg },
      ],
    }),

    votingOptions: builder.query<EntityState<VotingOption>, number>({
      query: (votingId) => ({
        url: `${API_BASE_POSTGREST}/${VOTING_OPTION_TABLE_NAME}?votingId=eq.${votingId}&select=*,authorId(id,login,displayName,avatarUrl)`,
      }),
      // providesTags: [{ type: 'VotingOption', id: 'LIST' }],
      transformResponse: (response: VotingOption[]) =>
        votingOptionsAdapter.addMany(
          votingOptionsAdapter.getInitialState(),
          response.map(transformVotingOption),
        ),
      onCacheEntryAdded: async (
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) => {
        let subscription: RealtimeSubscription | null = null;

        try {
          await cacheDataLoaded;

          subscription = supabase
            .from<VotingOption>(
              `${VOTING_OPTION_TABLE_NAME}:votingId=eq.${arg}`,
            )
            .on('*', (payload) =>
              updateCachedData((draft) => {
                if (payload.eventType === 'INSERT') {
                  votingOptionsAdapter.addOne(draft, payload.new);
                }

                if (payload.eventType === 'UPDATE') {
                  votingOptionsAdapter.updateOne(draft, {
                    id: payload.new.id,
                    changes: payload.new,
                  });
                }

                if (payload.eventType === 'DELETE') {
                  votingOptionsAdapter.removeOne(draft, payload.old.id);
                }
              }),
            )
            .subscribe();
        } catch {}

        await cacheEntryRemoved;

        if (subscription) supabase.removeSubscription(subscription);
      },
    }),
    createVotingOption: builder.mutation<VotingOption, CreateVotingOptionDto>({
      query: (body) => ({
        url: `${API_BASE}/voting-options`,
        method: 'POST',
        body,
      }),
      // invalidatesTags: [{ type: 'VotingOption', id: 'LIST' }],
    }),
    deleteVotingOption: builder.mutation<void, number>({
      query: (votingOptionId) => ({
        url: `${API_BASE}/voting-options/${votingOptionId}`,
        method: 'DELETE',
      }),
      // invalidatesTags: [{ type: 'VotingOption', id: 'LIST' }],
    }),

    votes: builder.query<EntityState<Vote>, number>({
      query: (votingId) => ({
        url: `${API_BASE_POSTGREST}/${VOTE_TABLE_NAME}?votingId=eq.${votingId}&select=authorId,votingId,votingOptionId,value`,
      }),
      // providesTags: [{ type: 'Vote', id: 'LIST' }],
      transformResponse: (response: Vote[]) =>
        votesAdapter.addMany(votesAdapter.getInitialState(), response),
      onCacheEntryAdded: async (
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) => {
        let subscription: RealtimeSubscription | null = null;

        try {
          await cacheDataLoaded;

          subscription = supabase
            .from<Vote>(`${VOTE_TABLE_NAME}:votingId=eq.${arg}`)
            .on('*', (payload) =>
              updateCachedData((draft) => {
                if (
                  payload.eventType === 'INSERT' ||
                  payload.eventType === 'UPDATE'
                ) {
                  votesAdapter.upsertOne(draft, payload.new);
                }

                if (payload.eventType === 'DELETE') {
                  votesAdapter.removeOne(draft, payload.old.authorId);
                }
              }),
            )
            .subscribe();
        } catch {}

        await cacheEntryRemoved;

        if (subscription) supabase.removeSubscription(subscription);
      },
    }),
    createVote: builder.mutation<void, number>({
      query: (votingOptionId) => ({
        url: `${API_BASE}/votes`,
        method: 'POST',
        body: { votingOptionId } as CreateVoteDto,
      }),
      // invalidatesTags: [{ type: 'Vote', id: 'LIST' }],
    }),
    deleteVote: builder.mutation<void, number>({
      query: (votingOptionId) => ({
        url: `${API_BASE}/votes`,
        method: 'DELETE',
        body: { votingOptionId } as DeleteVoteDto,
      }),
      // invalidatesTags: [{ type: 'Vote', id: 'LIST' }],
    }),

    chatVoting: builder.query<ChatVoting, string>({
      query: (broadcasterId) => ({
        url: `${API_BASE_POSTGREST}/${CHAT_VOTING_TABLE_NAME}`,
        params: { broadcasterId: `eq.${broadcasterId}` },
      }),
      // providesTags: [{ type: 'ChatVoting', id: 'ONE' }],
      transformResponse: (response: ChatVoting[]) => response[0],
      onCacheEntryAdded: async (
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) => {
        let subscription: RealtimeSubscription | null = null;

        try {
          await cacheDataLoaded;

          subscription = supabase
            .from<ChatVoting>(
              `${CHAT_VOTING_TABLE_NAME}:broadcasterId=eq.${arg}`,
            )
            .on('*', (payload) =>
              updateCachedData((): any => {
                if (payload.eventType === 'INSERT') return payload.new;
                if (payload.eventType === 'UPDATE') return payload.new;
                if (payload.eventType === 'DELETE') return null;
              }),
            )
            .subscribe();
        } catch {}

        await cacheEntryRemoved;

        if (subscription) supabase.removeSubscription(subscription);
      },
    }),
    createChatVoting: builder.mutation<ChatVoting, CreateChatVotingDto>({
      query: (body) => ({
        url: `${API_BASE}/chat-votes`,
        method: 'POST',
        body,
      }),
      // invalidatesTags: [{ type: 'ChatVoting', id: 'ONE' }],
    }),
    updateChatVoting: builder.mutation<
      ChatVoting,
      { chatVotingId: string; body: UpdateChatVotingDto }
    >({
      query: ({ chatVotingId, body }) => ({
        url: `${API_BASE}/chat-votes/${chatVotingId}`,
        method: 'PUT',
        body,
      }),
      // invalidatesTags: [{ type: 'ChatVoting', id: 'ONE' }],
    }),
    deleteChatVoting: builder.mutation<void, string>({
      query: (chatVotingId) => ({
        url: `${API_BASE}/chat-votes/${chatVotingId}`,
        method: 'DELETE',
      }),
    }),
    clearChatVoting: builder.mutation<void, string>({
      query: (chatVotingId) => ({
        url: `${API_BASE}/chat-votes/${chatVotingId}/clear`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'ChatVote', id: 'LIST' }],
    }),

    chatVotes: builder.query<EntityState<ChatVote>, string>({
      query: (chatVotingId) => ({
        url: `${API_BASE_POSTGREST}/${CHAT_VOTE_TABLE_NAME}`,
        params: { chatVotingId: `eq.${chatVotingId}` },
      }),
      providesTags: [{ type: 'ChatVote', id: 'LIST' }],
      transformResponse: (response: ChatVote[]) =>
        chatVotesAdapter.addMany(chatVotesAdapter.getInitialState(), response),
      onCacheEntryAdded: async (
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) => {
        let subscription: RealtimeSubscription | null = null;

        try {
          await cacheDataLoaded;

          subscription = supabase
            .from<ChatVote>(`${CHAT_VOTE_TABLE_NAME}:chatVotingId=eq.${arg}`)
            .on('*', (payload) =>
              updateCachedData((draft) => {
                if (payload.eventType === 'INSERT') {
                  chatVotesAdapter.addOne(draft, payload.new);
                }

                if (payload.eventType === 'UPDATE') {
                  chatVotesAdapter.updateOne(draft, {
                    id: payload.new.userId,
                    changes: payload.new,
                  });
                }

                if (payload.eventType === 'DELETE') {
                  chatVotesAdapter.removeOne(draft, payload.old.userId);
                }
              }),
            )
            .subscribe();
        } catch {}

        await cacheEntryRemoved;

        if (subscription) supabase.removeSubscription(subscription);
      },
    }),

    chatGoal: builder.query<ChatGoal, string>({
      query: (broadcasterId) => ({
        url: `${API_BASE_POSTGREST}/${CHAT_GOAL_TABLE_NAME}`,
        params: { broadcasterId: `eq.${broadcasterId}` },
      }),
      transformResponse: (response: ChatGoal[]) => response[0],
      onCacheEntryAdded: async (
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) => {
        let subscription: RealtimeSubscription | null = null;

        try {
          await cacheDataLoaded;

          subscription = supabase
            .from<ChatGoal>(`${CHAT_GOAL_TABLE_NAME}:broadcasterId=eq.${arg}`)
            .on('*', (payload) =>
              updateCachedData((): any => {
                if (payload.eventType === 'INSERT') return payload.new;
                if (payload.eventType === 'UPDATE') return payload.new;
                if (payload.eventType === 'DELETE') return null;
              }),
            )
            .subscribe();
        } catch {}

        await cacheEntryRemoved;

        if (subscription) supabase.removeSubscription(subscription);
      },
    }),
    createChatGoal: builder.mutation<ChatGoal, CreateChatGoalDto>({
      query: (body) => ({
        url: `${API_BASE}/chat-goal`,
        method: 'POST',
        body,
      }),
    }),
    updateChatGoal: builder.mutation<
      ChatGoal,
      { chatGoalId: string; body: UpdateChatGoalDto }
    >({
      query: ({ chatGoalId, body }) => ({
        url: `${API_BASE}/chat-goal/${chatGoalId}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteChatGoal: builder.mutation<void, string>({
      query: (chatGoalId) => ({
        url: `${API_BASE}/chat-goal/${chatGoalId}`,
        method: 'DELETE',
      }),
    }),

    startChatGoal: builder.mutation<void, string>({
      query: (chatGoalId) => ({
        url: `${API_BASE}/chat-goal/${chatGoalId}/start`,
        method: 'POST',
      }),
    }),
    pauseChatGoal: builder.mutation<void, string>({
      query: (chatGoalId) => ({
        url: `${API_BASE}/chat-goal/${chatGoalId}/pause`,
        method: 'POST',
      }),
    }),
    resetChatGoal: builder.mutation<void, string>({
      query: (chatGoalId) => ({
        url: `${API_BASE}/chat-goal/${chatGoalId}/reset`,
        method: 'POST',
      }),
    }),
    resetChatGoalVotes: builder.mutation<void, string>({
      query: (chatGoalId) => ({
        url: `${API_BASE}/chat-goal/${chatGoalId}/reset-votes`,
        method: 'POST',
      }),
    }),

    searchGames: builder.query<IgdbGame[], string>({
      query: (s) => ({ url: `${API_BASE}/games/search?s=${s}` }),
    }),
  }),
});

export const {
  useMeQuery,
  useMeRolesQuery,
  useUserQuery,

  useVotingListQuery,
  useVotingQuery,
  useCreateVotingMutation,
  useUpdateVotingMutation,
  useDeleteVotingMutation,

  useVotingOptionsQuery,
  useCreateVotingOptionMutation,
  useDeleteVotingOptionMutation,

  useVotesQuery,
  useCreateVoteMutation,
  useDeleteVoteMutation,

  useChatVotingQuery,
  useCreateChatVotingMutation,
  useUpdateChatVotingMutation,
  useDeleteChatVotingMutation,
  useClearChatVotingMutation,

  useChatVotesQuery,

  useChatGoalQuery,
  useCreateChatGoalMutation,
  useUpdateChatGoalMutation,
  useDeleteChatGoalMutation,

  useStartChatGoalMutation,
  usePauseChatGoalMutation,
  useResetChatGoalMutation,
  useResetChatGoalVotesMutation,

  useLazySearchGamesQuery,
} = api;
