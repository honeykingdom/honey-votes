import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./kinopoiskApiConstants";
import { FilmSearchByFiltersResponse } from "./kinopoiskApiTypes";

const prepareHeaders = (headers: Headers) => {
  headers.set("Accept", "application/json");
  headers.set("X-API-KEY", process.env.NEXT_PUBLIC_KINOPOISK_API_KEY);

  return headers;
};

export const kinopoiskApi = createApi({
  reducerPath: "kinopoiskApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, prepareHeaders }),
  endpoints: (builder) => ({
    searchMovies: builder.query<FilmSearchByFiltersResponse["films"], string>({
      query: (keyword) => ({
        url: `v2.1/films/search-by-keyword`,
        params: { keyword },
      }),
      transformResponse: (response: FilmSearchByFiltersResponse) =>
        response.films,
    }),
  }),
});

export const { useLazySearchMoviesQuery } = kinopoiskApi;
