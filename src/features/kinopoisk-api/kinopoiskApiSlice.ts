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
    filmsByKeyword: builder.query<FilmSearchByFiltersResponse, string>({
      query: (keyword) => ({
        url: `films/search-by-keyword`,
        params: { keyword },
      }),
    }),
  }),
});

export const { useFilmsByKeywordQuery } = kinopoiskApi;
