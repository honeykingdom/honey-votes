import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BadgeSets, TwitchBadgesResponse } from './twitchApiTypes';

export const twitchApi = createApi({
  reducerPath: 'twitchApi',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  endpoints: (builder) => ({
    globalBadges: builder.query<BadgeSets, void>({
      query: () =>
        'https://badges.twitch.tv/v1/badges/global/display?language=en',
      transformResponse: (response: TwitchBadgesResponse) =>
        response.badge_sets,
    }),
    channelBadges: builder.query<BadgeSets, string>({
      query: (id: string) =>
        `https://badges.twitch.tv/v1/badges/channels/${id}/display?language=en`,
      transformResponse: (response: TwitchBadgesResponse) =>
        response.badge_sets,
    }),
  }),
});

export const { useGlobalBadgesQuery, useChannelBadgesQuery } = twitchApi;
