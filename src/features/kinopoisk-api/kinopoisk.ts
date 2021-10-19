// import searchByKeywordResponse from "features/tournament/searchByKeyword.mock.json";

const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const BASE_URL = "https://kinopoiskapiunofficial.tech/api/v2.1/";

const headers = {
  Accept: "application/json",
  "X-API-KEY": process.env.NEXT_PUBLIC_KINOPOISK_API_KEY,
};

export type KinopoiskMovie = {
  filmId: number;
  nameRu: string;
  nameEn?: string;
  type?: string;
  year?: string;
  description?: string;
  filmLength?: string;
  countries?: {
    country: string;
  }[];
  genres?: {
    genre: string;
  }[];
  rating?: string;
  ratingVoteCount?: number;
  posterUrl?: string;
  posterUrlPreview?: string;
};

export type SearchByKeywordResponse = {
  keyword: string;
  pagesCount: number;
  films: KinopoiskMovie[];
  searchFilmsCountResult: number;
};

export const searchByKeyword = async (keyword: string) => {
  const response = await fetch(
    `${BASE_URL}films/search-by-keyword?keyword=${keyword}`,
    { headers }
  );

  return response.json() as unknown as SearchByKeywordResponse;

  // await sleep(1000);

  // return searchByKeywordResponse as SearchByKeywordResponse;
};
