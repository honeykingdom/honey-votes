import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RealtimeSubscription } from "@supabase/realtime-js";
import { parseCookies } from "nookies";
import supabase from "utils/supabase";
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

const API_BASE = `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}/api/honey-votes`;
const API_BASE_POSTGREST = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1`;

const VOTING_TABLE_NAME = "hv_voting";
const VOTING_OPTION_TABLE_NAME = "hv_voting_option";
const CHAT_VOTING_TABLE_NAME = "hv_chat_voting";
const CHAT_VOTE_TABLE_NAME = "hv_chat_vote";

const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY;
const SUPABASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

const COOKIE_ACCESS_TOKEN = "accessToken";

const getHeaders = () => {
  const cookies = parseCookies();

  return { Authorization: `Bearer ${cookies[COOKIE_ACCESS_TOKEN]}` };
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  tagTypes: ["ChatVoting"],
  endpoints: (builder) => ({
    me: builder.query<User, void>({
      query: () => ({
        url: `${API_BASE}/users/me`,
        headers: getHeaders(),
      }),
    }),
    meRoles: builder.query<UserRoles, string>({
      query: (channelId) => ({
        url: `${API_BASE}/users/me/${channelId}`,
        headers: getHeaders(),
      }),
    }),
    user: builder.query<
      User,
      { login: string; id?: never } | { login?: never; id: string }
    >({
      query: (arg) =>
        arg.login
          ? `${API_BASE}/users?login=${arg.login}`
          : `${API_BASE}/users?id=${arg.id}`,
    }),

    getVotingList: builder.query<Voting[], string>({
      query: (channelId) => ({
        url: `${API_BASE_POSTGREST}/${VOTING_TABLE_NAME}?broadcasterId=eq.${channelId}`,
        headers: SUPABASE_HEADERS,
      }),
    }),
    voting: builder.query<Voting, number>({
      query: (votingId) => ({
        url: `${API_BASE_POSTGREST}/${VOTING_TABLE_NAME}?id=eq.${votingId}`,
        headers: SUPABASE_HEADERS,
      }),
      transformResponse: (response) => response[0],
    }),
    createVoting: builder.mutation<Voting, AddVotingDto>({
      query: (body) => ({
        url: `${API_BASE}/voting`,
        method: "POST",
        headers: getHeaders(),
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
        headers: getHeaders(),
        body,
      }),
    }),
    deleteVoting: builder.mutation<void, number>({
      query: (votingId) => ({
        url: `${API_BASE}/voting/${votingId}`,
        method: "DELETE",
        headers: getHeaders(),
      }),
    }),

    votingOptions: builder.query<VotingOption[], number>({
      query: (votingId) => ({
        url: `${API_BASE_POSTGREST}/${VOTING_OPTION_TABLE_NAME}?votingId=eq.${votingId}`,
        headers: SUPABASE_HEADERS,
      }),
    }),
    createVotingOption: builder.mutation<VotingOption, AddVotingOptionDto>({
      query: (body) => ({
        url: `${API_BASE}/voting-options`,
        method: "POST",
        headers: getHeaders(),
        body,
      }),
    }),
    deleteVotingOption: builder.mutation<void, number>({
      query: (votingOptionId) => ({
        url: `${API_BASE}/voting-options/${votingOptionId}`,
        method: "DELETE",
        headers: getHeaders(),
      }),
    }),

    createVote: builder.mutation<void, number>({
      query: (votingOptionId) => ({
        url: `${API_BASE}/votes`,
        method: "POST",
        headers: getHeaders(),
        body: { votingOptionId } as AddVoteDto,
      }),
    }),
    deleteVote: builder.mutation<void, number>({
      query: (voteId) => ({
        url: `${API_BASE}/votes/${voteId}`,
        method: "DELETE",
        headers: getHeaders(),
      }),
    }),

    chatVoting: builder.query<ChatVoting, string>({
      query: (broadcasterId) => ({
        url: `${API_BASE_POSTGREST}/${CHAT_VOTING_TABLE_NAME}?broadcasterId=eq.${broadcasterId}`,
        headers: SUPABASE_HEADERS,
      }),
      transformResponse: (response) => response[0],
      providesTags: (result) => [
        { type: "ChatVoting", id: result.broadcasterId },
      ],
    }),
    createChatVoting: builder.mutation<ChatVoting, AddChatVotingDto>({
      query: (body) => ({
        url: `${API_BASE}/chat-votes`,
        method: "POST",
        headers: getHeaders(),
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
        headers: getHeaders(),
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
        headers: getHeaders(),
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ChatVoting", id: arg },
      ],
    }),
    clearChatVoting: builder.mutation<void, string>({
      query: (chatVotingId) => ({
        url: `${API_BASE}/chat-votes/${chatVotingId}/clear`,
        method: "POST",
        headers: getHeaders(),
      }),
    }),

    getChatVotes: builder.query<ChatVote[], string>({
      query: (chatVotingId) => ({
        url: `${API_BASE_POSTGREST}/${CHAT_VOTE_TABLE_NAME}?chatVotingId=eq.${chatVotingId}`,
        headers: SUPABASE_HEADERS,
      }),
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
            .on("*", (payload) => {
              updateCachedData((draft) => {
                if (payload.eventType === "INSERT") {
                  draft.push(payload.new);
                }

                if (payload.eventType === "UPDATE") {
                  const index = draft.findIndex(
                    (chatVote) => chatVote.userId === payload.old.userId
                  );
                  draft.splice(index, 1, payload.new);
                }

                if (payload.eventType === "DELETE") {
                  const index = draft.findIndex(
                    (chatVote) => chatVote.userId === payload.old.userId
                  );
                  draft.splice(index, 1);
                }
              });
            })
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

  useGetVotingListQuery,
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

  useGetChatVotesQuery,
} = api;
