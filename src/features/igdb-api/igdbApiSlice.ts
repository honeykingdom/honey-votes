import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Game, Cover, Genre } from "igdb-api-types";
import {
  API_BASE_POSTGREST,
  SUPABASE_HEADERS,
} from "features/api/apiConstants";

const prepareHeaders = (headers: Headers) => {
  Object.entries(SUPABASE_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return headers;
};

type IgdbGameBase = Pick<Game, "id" | "first_release_date" | "name" | "slug">;
type IgdbGameCover = Pick<Cover, "id" | "image_id">;
type IgdbGameGenre = Pick<Genre, "id" | "name">;
export type IgdbGame = IgdbGameBase & {
  cover?: IgdbGameCover;
  genres?: IgdbGameGenre[];
  release_dates?: number[];
};

export const igdbApi = createApi({
  reducerPath: "igdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_POSTGREST, prepareHeaders }),
  endpoints: (builder) => ({
    searchGames: builder.query<IgdbGame[], string>({
      query: (query) => ({
        url: "/rpc/igdb",
        method: "POST",
        body: {
          endpoint: "games",
          body: `search "${query}"; fields cover.image_id,first_release_date,genres.name,name,release_dates,slug;`,
        },
      }),
    }),
  }),
});

export const { useLazySearchGamesQuery } = igdbApi;
