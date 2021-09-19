import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { parseCookies } from "nookies";
import {
  AddVoteDto,
  AddVotingDto,
  AddVotingOptionDto,
  UpdateVotingDto,
  User,
  Voting,
  VotingOption,
} from "./types";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://honeykingdom.herokuapp.com/api"
    : "http://localhost:3000/api";
const API_BASE_POSTGREST = "https://yhdkhaixlkqcmhovtxsw.supabase.co/rest/v1";

const VOTING_TABLE_NAME = "hv_voting";
const VOTING_OPTION_TABLE_NAME = "hv_voting_option";

const SUPABASE_KEY = "supabase-key";
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
    me: builder.query<User, void>({
      query: () => ({
        url: `${API_BASE}/users/me`,
        headers: getHeaders(),
      }),
    }),
    getChannelIdByName: builder.query<User, string>({
      query: (channelName) => `${API_BASE}/users/${channelName}`,
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
  }),
});

export const {
  useMeQuery,
  useGetChannelIdByNameQuery,

  useGetVotingListQuery,
  useGetVotingQuery,
  useCreateVotingMutation,
  useUpdateVotingMutation,

  useGetVotingOptionsQuery,
  useCreateVotingOptionMutation,
  useDeleteVotingOptionMutation,

  useCreateVoteMutation,
  useDeleteVoteMutation,
} = api;
