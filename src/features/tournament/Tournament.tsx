import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import { shuffle } from "d3-array";
import { Box, Button, Grid, Typography } from "@material-ui/core";

import SpinningWheel, {
  SpinningWheelRef,
  WheelSegment,
} from "../../../react-spinning-wheel-canvas/src";
import ArrowRightIcon from "icons/arrow-right.svg";
import getRandomInt from "utils/getRandomInt";
import MovieCard from "./MovieCard";
// import MoviePicker from "./MoviePicker";
import useTournament from "./useTournament";
import { Step } from "./types";

const beginSfx = "/assets/begin.opus";
const wheelSfx = "/assets/wheel.opus";
const noNoNoSfx = "/assets/nonono.opus";
const ohMySfx = "/assets/oh-my.opus";
const threeHundredSfx = "/assets/three-hundred.opus";
const viewersChoiceSfx = "/assets/viewers-choice.opus";

const STEPS_TEXT = {
  ADD_MOVIES: {
    title: "Добавление фильмов",
    description: "",
    buttonTitle: "Начать турнир",
  },
  START_TOURNAMENT: {
    title: "Турнир начинается",
    description: "",
    buttonTitle: "Пропустить вступление",
  },
  VIEWERS_CHOICE: {
    title: "Зрители решают",
    description: "Выберите фильм, который нужно убрать",
    buttonTitle: "Далее",
  },
  STREAMER_CHOICE: {
    title: "Стример решает",
    description: "Выберите фильм, который нужно убрать",
    buttonTitle: "Далее",
  },
  RANDOM_CHOICE: {
    title: "Рандом решает",
    description: "Выпавший в колесе вариант вылетает",
    buttonTitle: "Далее",
  },
  SHOW_WINNER: {
    title: "Победитель",
    description: "",
    buttonTitle: "Турнир окончен",
  },
};

const WHEEL_COLORS = {
  wheelBackground: "#212121",
  text: "#fff",
  border: "#fff",
};

const getCardSize = (itemsCount: number) => {
  if (itemsCount <= 6) return "large";

  if (itemsCount <= 8) return "medium";

  return "small";
};

const SOUND_OPTIONS = { volume: 1 };

type Segment = WheelSegment & { id: string };

type Props = {
  initialMovies: string[];
};

const Tournament = ({ initialMovies }: Props) => {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const { step, stepIndex, updateInput, nextStep } =
    useTournament(initialMovies);

  const currentStepType = useRef<Step["type"]>(step.type);

  currentStepType.current = step.type;

  const spinningWheelRef = useRef<SpinningWheelRef>();

  const cardSize = getCardSize(step.movies.length);

  const [playBegin] = useSound(beginSfx, SOUND_OPTIONS);
  const [playWheel] = useSound(wheelSfx, SOUND_OPTIONS);
  const [playNoNoNo] = useSound(noNoNoSfx, SOUND_OPTIONS);
  const [playOhMy] = useSound(ohMySfx, SOUND_OPTIONS);
  const [playThreeHundred] = useSound(threeHundredSfx, SOUND_OPTIONS);
  const [playViewersChoice] = useSound(viewersChoiceSfx, SOUND_OPTIONS);

  // TODO: hack to prevent material ui render bug
  const [mode, setMode] = useState<"edit" | "view">("view");

  const [wheelSegments, setWheelSegments] = useState<Segment[]>([]);

  useEffect(() => {
    if (step.type === "ADD_MOVIES") {
      setMode("edit");
    } else {
      setMode("view");
    }

    if (step.type === "RANDOM_CHOICE") {
      setWheelSegments(
        shuffle([...step.movies]).map((m, i) => ({
          id: m.id,
          title: m.title,
          backgroundColor: i % 2 === 0 ? "#2f2f2f" : "#212121",
        }))
      );

      setTimeout(() => {
        spinningWheelRef.current.startSpinning(30, 4);
        playWheel();
      }, 1000);
    }

    if (step.type === "VIEWERS_CHOICE") {
      playViewersChoice();
    }

    if (step.type === "STREAMER_CHOICE") {
      const i = getRandomInt(0, 2);

      if (i === 0) playOhMy();
      if (i === 1) playThreeHundred();
    }
  }, [stepIndex, step.type]);

  let isNextButtonDisabled = false;

  if (step.type === "ADD_MOVIES") {
    if (step.movies.filter((m) => m.title).length < 2) {
      isNextButtonDisabled = true;
    }
  }

  if (step.type === "SHOW_WINNER") {
    isNextButtonDisabled = true;
  }

  if (
    step.type === "VIEWERS_CHOICE" ||
    step.type === "STREAMER_CHOICE" ||
    step.type === "RANDOM_CHOICE"
  ) {
    if (selectedMovieId === null) {
      isNextButtonDisabled = true;
    }
  }

  const showMoviesList =
    step.type !== "RANDOM_CHOICE" && step.type !== "SHOW_WINNER";

  const handleNextButton = () => {
    if (step.type === "ADD_MOVIES") {
      playBegin();
      nextStep();

      setTimeout(() => {
        if (currentStepType.current === "START_TOURNAMENT") {
          nextStep();
        }
      }, 10000);

      return;
    }

    nextStep(selectedMovieId);
    setSelectedMovieId(null);
  };

  const renderMoviesList = () => (
    <Grid container justifyContent="center">
      <Grid item xs={6}>
        <Grid container spacing={1}>
          {step.movies.map((movie, i) => (
            <Grid item xs={12} key={movie.id}>
              <Box sx={{ position: "relative" }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  component="span"
                  textAlign="center"
                  sx={{
                    position: "absolute",
                    left: -48,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 48,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}.
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <MovieCard
                    movie={movie}
                    size={cardSize}
                    mode={mode}
                    value={step.movies[i].title}
                    active={selectedMovieId === movie.id}
                    onClick={() => setSelectedMovieId(movie.id)}
                    onChange={(e) => updateInput(i, e.target.value)}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );

  const renderSpinningWheel = () => (
    <Box display="flex" justifyContent="center">
      <Box sx={{ position: "relative", width: 540 }}>
        <SpinningWheel
          size={540}
          segments={wheelSegments}
          wheelColors={WHEEL_COLORS}
          spinningWheelRef={spinningWheelRef}
          onSpinEnd={(index) => {
            setSelectedMovieId(wheelSegments[index].id);
            playNoNoNo();
          }}
        />
        <ArrowRightIcon
          style={{
            position: "absolute",
            top: "50%",
            left: 1,
            width: 32,
            height: 32,
            transform: "translateY(-50%)",
            fill: "#212121",
            stroke: "#fff",
          }}
        />
      </Box>
    </Box>
  );

  const renderWinner = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography variant="h3" component="span" textAlign="center">
        {step.movies[0].title}
      </Typography>
      <audio
        src={process.env.NEXT_PUBLIC_TOURNAMENT_WINNER_SOUND_URL}
        autoPlay
      />
    </Box>
  );

  return (
    <>
      <Typography
        variant="h3"
        textAlign="center"
        sx={{ mt: 1, mb: 2, fontWeight: 300 }}
      >
        Фильмовый турнир
      </Typography>

      <Box sx={{ mb: 2, height: 568 }}>
        {showMoviesList && renderMoviesList()}
        {step.type === "RANDOM_CHOICE" && renderSpinningWheel()}
        {step.type === "SHOW_WINNER" && renderWinner()}
      </Box>

      <Typography
        variant="h4"
        component="div"
        textAlign="center"
        sx={{ mb: 0, fontWeight: 300 }}
      >
        {STEPS_TEXT[step.type].title}
      </Typography>

      <Typography
        variant="body1"
        component="div"
        textAlign="center"
        sx={{ mb: 2, fontWeight: 300 }}
      >
        {STEPS_TEXT[step.type].description}
      </Typography>

      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          size="large"
          disabled={isNextButtonDisabled}
          onClick={handleNextButton}
        >
          {STEPS_TEXT[step.type].buttonTitle}
        </Button>
      </Box>
    </>
  );
};

export default Tournament;
