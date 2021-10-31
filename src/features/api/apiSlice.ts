import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { RealtimeSubscription } from "@supabase/realtime-js";
import supabase from "utils/supabase";
import apiQuery from "./apiQuery";
import {
  API_BASE,
  API_BASE_POSTGREST,
  CHAT_VOTE_TABLE_NAME,
  CHAT_VOTING_TABLE_NAME,
  USER_TABLE_NAME,
  VOTING_OPTION_TABLE_NAME,
  VOTING_TABLE_NAME,
} from "./constants";
import {
  AddChatVotingDto,
  AddVoteDto,
  AddVotingDto,
  AddVotingOptionDto,
  ChatVote,
  ChatVoting,
  UpdateChatVotingDto,
  UpdateVotingDto,
  User,
  UserRoles,
  Voting,
  VotingOption,
} from "./types";

type LoginOrId = { login: string; id?: never } | { login?: never; id: string };

// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#normalizing-data-with-createentityadapter
const votingOptionsAdapter = createEntityAdapter<VotingOption>({
  sortComparer: (a, b) => a.fullVotesValue - b.fullVotesValue,
});

export const votingOptionsSelectors = votingOptionsAdapter.getSelectors();

const chatVotesAdapter = createEntityAdapter<ChatVote>({
  selectId: (chatVote) => chatVote.userId,
  sortComparer: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

export const chatVotesSelectors = chatVotesAdapter.getSelectors();

export const api = createApi({
  reducerPath: "api",
  baseQuery: apiQuery,
  tagTypes: ["ChatVoting"],
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
      transformResponse: (response) => response[0],
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, string>({
      query: (refreshToken) => ({
        url: `${API_BASE}/auth/refresh-token`,
        method: "POST",
        body: { refreshToken },
      }),
    }),

    votingList: builder.query<Voting[], string>({
      query: (channelId) => ({
        url: `${API_BASE_POSTGREST}/${VOTING_TABLE_NAME}`,
        params: { broadcasterId: `eq.${channelId}` },
      }),
    }),
    voting: builder.query<Voting, number>({
      query: (votingId) => ({
        url: `${API_BASE_POSTGREST}/${VOTING_TABLE_NAME}`,
        params: { id: `eq.${votingId}` },
      }),
      transformResponse: (response) => response[0],
    }),
    createVoting: builder.mutation<Voting, AddVotingDto>({
      query: (body) => ({
        url: `${API_BASE}/voting`,
        method: "POST",
        body,
      }),
    }),
    updateVoting: builder.mutation<
      Voting,
      { votingId: number; body: UpdateVotingDto }
    >({
      query: ({ votingId, body }) => ({
        url: `${API_BASE}/voting/${votingId}`,
        method: "PUT",
        body,
      }),
    }),
    deleteVoting: builder.mutation<void, number>({
      query: (votingId) => ({
        url: `${API_BASE}/voting/${votingId}`,
        method: "DELETE",
      }),
    }),

    votingOptions: builder.query<EntityState<VotingOption>, number>({
      query: (votingId) => ({
        url: `${API_BASE_POSTGREST}/${VOTING_OPTION_TABLE_NAME}`,
        params: { votingId: `eq.${votingId}` },
      }),
      transformResponse: (response: VotingOption[]) =>
        votingOptionsAdapter.addMany(
          votingOptionsAdapter.getInitialState(),
          response
        ),
      onCacheEntryAdded: async (
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) => {
        let subscription: RealtimeSubscription | null = null;

        try {
          await cacheDataLoaded;

          subscription = supabase
            .from<VotingOption>(
              `${VOTING_OPTION_TABLE_NAME}:votingId=eq.${arg}`
            )
            .on("*", (payload) =>
              updateCachedData((draft) => {
                if (payload.eventType === "INSERT") {
                  votingOptionsAdapter.addOne(draft, payload.new);
                }

                if (payload.eventType === "UPDATE") {
                  votingOptionsAdapter.updateOne(draft, {
                    id: payload.new.id,
                    changes: payload.new,
                  });
                }

                if (payload.eventType === "DELETE") {
                  votingOptionsAdapter.removeOne(draft, payload.old.id);
                }
              })
            )
            .subscribe();
        } catch {}

        await cacheEntryRemoved;

        if (subscription) supabase.removeSubscription(subscription);
      },
    }),
    createVotingOption: builder.mutation<VotingOption, AddVotingOptionDto>({
      query: (body) => ({
        url: `${API_BASE}/voting-options`,
        method: "POST",
        body,
      }),
    }),
    deleteVotingOption: builder.mutation<void, number>({
      query: (votingOptionId) => ({
        url: `${API_BASE}/voting-options/${votingOptionId}`,
        method: "DELETE",
      }),
    }),

    createVote: builder.mutation<void, number>({
      query: (votingOptionId) => ({
        url: `${API_BASE}/votes`,
        method: "POST",
        body: { votingOptionId } as AddVoteDto,
      }),
    }),
    deleteVote: builder.mutation<void, number>({
      query: (voteId) => ({
        url: `${API_BASE}/votes/${voteId}`,
        method: "DELETE",
      }),
    }),

    chatVoting: builder.query<ChatVoting, string>({
      query: (broadcasterId) => ({
        url: `${API_BASE_POSTGREST}/${CHAT_VOTING_TABLE_NAME}`,
        params: { broadcasterId: `eq.${broadcasterId}` },
      }),
      transformResponse: (response) => response[0],
      providesTags: (result, error, arg) => [{ type: "ChatVoting", id: arg }],
    }),
    createChatVoting: builder.mutation<ChatVoting, AddChatVotingDto>({
      query: (body) => ({
        url: `${API_BASE}/chat-votes`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => [
        { type: "ChatVoting", id: result.broadcasterId },
      ],
    }),
    updateChatVoting: builder.mutation<
      ChatVoting,
      { chatVotingId: string; body: UpdateChatVotingDto }
    >({
      query: ({ chatVotingId, body }) => ({
        url: `${API_BASE}/chat-votes/${chatVotingId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result) => [
        { type: "ChatVoting", id: result.broadcasterId },
      ],
    }),
    deleteChatVoting: builder.mutation<void, string>({
      query: (chatVotingId) => ({
        url: `${API_BASE}/chat-votes/${chatVotingId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ChatVoting", id: arg },
      ],
    }),
    clearChatVoting: builder.mutation<void, string>({
      query: (chatVotingId) => ({
        url: `${API_BASE}/chat-votes/${chatVotingId}/clear`,
        method: "POST",
      }),
    }),

    chatVotes: builder.query<EntityState<ChatVote>, string>({
      query: (chatVotingId) => ({
        url: `${API_BASE_POSTGREST}/${CHAT_VOTE_TABLE_NAME}`,
        params: { chatVotingId: `eq.${chatVotingId}` },
      }),
      transformResponse: (response: ChatVote[]) =>
        chatVotesAdapter.addMany(chatVotesAdapter.getInitialState(), response),
      // https://redux-toolkit.js.org/rtk-query/usage/streaming-updates
      onCacheEntryAdded: async (
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) => {
        let subscription: RealtimeSubscription | null = null;

        try {
          await cacheDataLoaded;

          subscription = supabase
            .from<ChatVote>(`${CHAT_VOTE_TABLE_NAME}:chatVotingId=eq.${arg}`)
            .on("*", (payload) =>
              updateCachedData((draft) => {
                if (payload.eventType === "INSERT") {
                  chatVotesAdapter.addOne(draft, payload.new);
                }

                if (payload.eventType === "UPDATE") {
                  chatVotesAdapter.updateOne(draft, {
                    id: payload.new.userId,
                    changes: payload.new,
                  });
                }

                if (payload.eventType === "DELETE") {
                  chatVotesAdapter.removeOne(draft, payload.old.userId);
                }
              })
            )
            .subscribe();
        } catch {}

        await cacheEntryRemoved;

        if (subscription) supabase.removeSubscription(subscription);
      },
    }),
  }),
});

export const {
  useMeQuery,
  useMeRolesQuery,
  useUserQuery,

  useRefreshTokenMutation,

  useVotingListQuery,
  useVotingQuery,
  useCreateVotingMutation,
  useUpdateVotingMutation,

  useVotingOptionsQuery,
  useCreateVotingOptionMutation,
  useDeleteVotingOptionMutation,

  useCreateVoteMutation,
  useDeleteVoteMutation,

  useChatVotingQuery,
  useCreateChatVotingMutation,
  useUpdateChatVotingMutation,
  useDeleteChatVotingMutation,
  useClearChatVotingMutation,

  useChatVotesQuery,
} = api;
