import { useCallback, useState } from 'react';
import produce from 'immer';
import getRandomInt from 'utils/getRandomInt';
import { Film } from 'features/kinopoisk-api/kinopoiskApiTypes';
import { Movie, Step, StepAddMovies, StepType } from './tournamentTypes';

const choiceStepTypes = [
  StepType.VIEWERS_CHOICE,
  StepType.STREAMER_CHOICE,
  StepType.RANDOM_CHOICE,
];

const getInitialSteps = (initialMovies: string[] = []) => {
  const addMoviesInitialStep: StepAddMovies = {
    type: StepType.ADD_MOVIES,
    movies: Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: initialMovies[i] || '',
    })),
  };

  return [addMoviesInitialStep];
};

const getRandomChoiceStep = (movies: Movie[]): Step => {
  const randomIndex = getRandomInt(0, choiceStepTypes.length);

  return {
    type: choiceStepTypes[randomIndex],
    movies,
  };
};

const getNextStep = (
  prevStep: Step,
  selectedMovieId?: number | string,
): Step | null => {
  if (prevStep.type === StepType.SHOW_WINNER) return null;

  if (prevStep.type === StepType.ADD_MOVIES) {
    return {
      type: StepType.START_TOURNAMENT,
      movies: prevStep.movies.filter((m) => m.title),
    };
  }

  const newMovies =
    prevStep.type === StepType.START_TOURNAMENT
      ? prevStep.movies
      : prevStep.movies.filter((m) => m.id !== selectedMovieId);

  if (newMovies.length > 2) {
    return getRandomChoiceStep(newMovies);
  }

  if (newMovies.length === 2) {
    return {
      type: StepType.VIEWERS_CHOICE,
      movies: newMovies,
    };
  }

  return {
    type: StepType.SHOW_WINNER,
    movies: newMovies,
  };
};

const getCurrentStep = (steps: Step[]) => steps[steps.length - 1];

const useTournament = (initialMovies: string[]) => {
  const [steps, setSteps] = useState<Step[]>(() =>
    getInitialSteps(initialMovies),
  );

  const step = getCurrentStep(steps);
  const stepIndex = steps.length - 1;

  const addMovie = useCallback((movie: Movie) => {
    setSteps((prev) =>
      produce(prev, (state) => {
        const currentStep = getCurrentStep(state);

        if (currentStep.type !== StepType.ADD_MOVIES) return prev;

        currentStep.movies.push(movie);
      }),
    );
  }, []);

  const updateMovie = useCallback((id: string, movie: Movie) => {
    setSteps((prev) =>
      produce(prev, (state) => {
        const currentStep = getCurrentStep(state);

        if (currentStep.type !== StepType.ADD_MOVIES) return state;

        const index = currentStep.movies.findIndex((m) => m.id === id);

        if (id) {
          currentStep.movies[index] = movie;
        }
      }),
    );
  }, []);

  const updateInput = useCallback(
    (index: number, title: string | null = null, info: Film | null = null) => {
      setSteps((prev) =>
        produce(prev, (state) => {
          const currentStep = getCurrentStep(state);

          if (currentStep.type !== StepType.ADD_MOVIES) return prev;

          if (title !== null) {
            currentStep.movies[index].title = title;
          }

          if (info !== null) {
            currentStep.movies[index].info = info;
          }
        }),
      );
    },
    [],
  );

  const nextStep = useCallback((selectedMovieId?: number | string) => {
    setSteps((prev) =>
      produce(prev, (state) => {
        const currentStep = getCurrentStep(state);
        const next = getNextStep(currentStep, selectedMovieId);

        if (next) {
          state.push(next);
        }
      }),
    );
  }, []);

  const prevStep = useCallback(() => {
    if (steps.length === 1) return;

    setSteps((prev) =>
      produce(prev, (state) => {
        state.pop();
      }),
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
