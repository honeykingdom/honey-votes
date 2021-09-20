import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { parseCookies } from "nookies";
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

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://honeykingdom.herokuapp.com/api/honey-votes"
    : "http://localhost:3000/api/honey-votes";
const API_BASE_POSTGREST = "https://yhdkhaixlkqcmhovtxsw.supabase.co/rest/v1";

const VOTING_TABLE_NAME = "hv_voting";
const VOTING_OPTION_TABLE_NAME = "hv_voting_option";
const CHAT_VOTING_TABLE_NAME = "hv_chat_voting";
const CHAT_VOTES_TABLE_NAME = "hv_chat_votes";

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
  baseQuery: fetchBaseQuery(),
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({
        url: `${API_BASE}/users/me`,
        headers: getHeaders(),
      }),
    }),
    getMeRoles: builder.query<UserRoles, string>({
      query: (channelId) => ({
        url: `${API_BASE}/users/me/${channelId}`,
        headers: getHeaders(),
      }),
    }),
    getUserByLogin: builder.query<User, string>({
      query: (channelName) => `${API_BASE}/users?login=${channelName}`,
    }),
    getUserById: builder.query<User, string>({
      query: (channelId) => `${API_BASE}/users?id=${channelId}`,
    }),

    getVotingList: builder.query<Voting[], string>({
      query: (channelId) => ({
        url: `${API_BASE_POSTGREST}/${VOTING_TABLE_NAME}?broadcasterId=eq.${channelId}`,
        headers: SUPABASE_HEADERS,
      }),
    }),
    getVoting: builder.query<Voting, number>({
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

    getVotingOptions: builder.query<VotingOption[], number>({
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

    getChatVoting: builder.query<ChatVoting, string>({
      query: (broadcasterId) => ({
        url: `${API_BASE_POSTGREST}/${CHAT_VOTING_TABLE_NAME}?broadcasterId=eq.${broadcasterId}`,
        headers: SUPABASE_HEADERS,
      }),
      transformResponse: (response) => response[0],
    }),
    createChatVoting: builder.mutation<ChatVoting, AddChatVotingDto>({
      query: (body) => ({
        url: `${API_BASE}/chat-votes`,
        method: "POST",
        headers: getHeaders(),
        body,
      }),
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
    }),
    deleteChatVoting: builder.mutation<void, string>({
      query: (chatVotingId) => ({
        url: `${API_BASE}/chat-votes/${chatVotingId}`,
        method: "DELETE",
        headers: getHeaders(),
      }),
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
        url: `${API_BASE_POSTGREST}/${CHAT_VOTES_TABLE_NAME}?chatVotingId=eq.${chatVotingId}`,
        headers: SUPABASE_HEADERS,
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetMeRolesQuery,
  useGetUserByLoginQuery,
  useGetUserByIdQuery,

  useGetVotingListQuery,
  useGetVotingQuery,
  useCreateVotingMutation,
  useUpdateVotingMutation,

  useGetVotingOptionsQuery,
  useCreateVotingOptionMutation,
  useDeleteVotingOptionMutation,

  useCreateVoteMutation,
  useDeleteVoteMutation,

  useGetChatVotingQuery,
  useCreateChatVotingMutation,
  useUpdateChatVotingMutation,
  useDeleteChatVotingMutation,
  useClearChatVotingMutation,

  useGetChatVotesQuery,
} = api;
