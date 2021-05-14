import { useCallback, useState } from "react";
import produce from "immer";
import getRandomInt from "utils/getRandomInt";
import { KinopoiskMovie } from "api/kinopoisk";
import { Movie, Step, StepAddMovies } from "./types";

const addMoviesInitialStep: StepAddMovies = {
  type: "ADD_MOVIES",
  movies: Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 1}`,
    title: "",
  })),
};

const choiceStepTypes = [
  "VIEWERS_CHOICE" as const,
  "STREAMER_CHOICE" as const,
  "RANDOM_CHOICE" as const,
] as const;

const getRandomChoiceStep = (movies: Movie[]): Step => {
  const randomIndex = getRandomInt(0, choiceStepTypes.length);

  return {
    type: choiceStepTypes[randomIndex],
    movies,
  };
};

const getNextStep = (
  prevStep: Step,
  selectedMovieId?: number | string
): Step => {
  if (prevStep.type === "SHOW_WINNER") return null;

  if (prevStep.type === "ADD_MOVIES") {
    return {
      type: "START_TOURNAMENT" as const,
      movies: prevStep.movies.filter((m) => m.title),
    };
  }

  if (prevStep.movies.length >= 3) {
    const newMovies = prevStep.movies
      .filter((m) => m.title)
      .filter((m) => m.id !== selectedMovieId);

    return getRandomChoiceStep(newMovies);
  }

  return {
    type: "SHOW_WINNER" as const,
    movies: prevStep.movies,
  };
};

const getCurrentStep = (steps: Step[]) => steps[steps.length - 1];

const useTournament = () => {
  const [steps, setSteps] = useState<Step[]>([addMoviesInitialStep]);

  const step = getCurrentStep(steps);
  const stepIndex = steps.length - 1;

  const addMovie = useCallback((movie: Movie) => {
    setSteps((prev) =>
      produce(prev, (state) => {
        const currentStep = getCurrentStep(state);

        if (currentStep.type !== "ADD_MOVIES") return prev;

        currentStep.movies.push(movie);
      })
    );
  }, []);

  const updateMovie = useCallback((id: string, movie: Movie) => {
    setSteps((prev) =>
      produce(prev, (state) => {
        const currentStep = getCurrentStep(state);

        if (currentStep.type !== "ADD_MOVIES") return state;

        const index = currentStep.movies.findIndex((m) => m.id === id);

        if (id) {
          currentStep.movies[index] = movie;
        }
      })
    );
  }, []);

  const updateInput = useCallback(
    (
      index: number,
      title: string | null = null,
      info: KinopoiskMovie | null = null
    ) => {
      setSteps((prev) =>
        produce(prev, (state) => {
          const currentStep = getCurrentStep(state);

          if (currentStep.type !== "ADD_MOVIES") return prev;

          if (title !== null) {
            currentStep.movies[index].title = title;
          }

          if (info !== null) {
            currentStep.movies[index].info = info;
          }
        })
      );
    },
    []
  );

  const nextStep = useCallback((selectedMovieId?: number | string) => {
    setSteps((prev) =>
      produce(prev, (state) => {
        const currentStep = getCurrentStep(state);
        const next = getNextStep(currentStep, selectedMovieId);

        if (next) {
          state.push(next);
        }
      })
    );
  }, []);

  const prevStep = useCallback(() => {
    if (steps.length === 1) return;

    setSteps((prev) =>
      produce(prev, (state) => {
        state.pop();
      })
    );
  }, []);

  return {
    step,
    stepIndex,
    addMovie,
    updateMovie,
    updateInput,
    nextStep,
    prevStep,
  };
};

export default useTournament;
