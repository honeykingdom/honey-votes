import { components } from './kinopoiskApiTypes.generated';

export type Film = components['schemas']['FilmSearchResponse_films'];
export type FilmSearchByFiltersResponse =
  components['schemas']['FilmSearchByFiltersResponse'];
