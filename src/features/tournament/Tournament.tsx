import { useEffect, useRef, useState, useCallback } from "react";
import useSound from "use-sound";
import { shuffle } from "d3-array";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

import SpinningWheel, {
  SpinningWheelRef,
  WheelSegment,
} from "../../../react-spinning-wheel-canvas/src";
import VolumeControl from "components/VolumeControl";
import ArrowRightIcon from "icons/arrow-right.svg";
import getRandomInt from "utils/getRandomInt";
import MovieCard from "./MovieCard";
// import MoviePicker from "./MoviePicker";
import useTournament from "./useTournament";
import { Step, StepType } from "./types";

const beginSfx = "/assets/begin.opus";
const wheelSfx = "/assets/wheel.opus";
const noNoNoSfx = "/assets/nonono.opus";
const ohMySfx = "/assets/oh-my.opus";
const threeHundredSfx = "/assets/three-hundred.opus";
const viewersChoiceSfx = "/assets/viewers-choice.opus";

type StepText = {
  title: string;
  description: string;
  buttonTitle: string;
};

const STEPS_TEXT: Record<StepType, StepText> = {
  [StepType.ADD_MOVIES]: {
    title: "Добавление фильмов",
    description: "",
    buttonTitle: "Начать турнир",
  },
  [StepType.START_TOURNAMENT]: {
    title: "Турнир начинается",
    description: "",
    buttonTitle: "Пропустить вступление",
  },
  [StepType.VIEWERS_CHOICE]: {
    title: "Зрители решают",
    description: "Выберите фильм, который нужно убрать",
    buttonTitle: "Далее",
  },
  [StepType.STREAMER_CHOICE]: {
    title: "Стример решает",
    description: "Выберите фильм, который нужно убрать",
    buttonTitle: "Далее",
  },
  [StepType.RANDOM_CHOICE]: {
    title: "Рандом решает",
    description: "Выпавший в колесе вариант вылетает",
    buttonTitle: "Далее",
  },
  [StepType.SHOW_WINNER]: {
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

type Segment = WheelSegment & { id: string };

type Props = {
  initialMovies: string[];
};

const Tournament = ({ initialMovies }: Props) => {
  const windowSize = useWindowSize();

  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const { step, stepIndex, updateInput, nextStep } =
    useTournament(initialMovies);

  const [volume, setVolume] = useState(0.5);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  const currentStepType = useRef<Step["type"]>(step.type);
  currentStepType.current = step.type;

  const spinningWheelRef = useRef<SpinningWheelRef>();
  const isWheelStarted = useRef(false);

  const audioElemRef = useRef<HTMLAudioElement>();
  const audioRef = useCallback((audio: HTMLAudioElement) => {
    audio.volume = volumeRef.current;
    audioElemRef.current = audio;
  }, []);

  const cardSize = getCardSize(step.movies.length);

  const [playBegin] = useSound(beginSfx, { volume });
  const [playWheel] = useSound(wheelSfx, { volume });
  const [playNoNoNo] = useSound(noNoNoSfx, { volume });
  const [playOhMy] = useSound(ohMySfx, { volume });
  const [playThreeHundred] = useSound(threeHundredSfx, { volume });
  const [playViewersChoice] = useSound(viewersChoiceSfx, { volume });

  // TODO: hack to prevent material ui render bug
  const [mode, setMode] = useState<"edit" | "view">("view");

  const [wheelSegments, setWheelSegments] = useState<Segment[]>([]);

  useEffect(() => {
    if (step.type === StepType.ADD_MOVIES) {
      setMode("edit");
    } else {
      setMode("view");
    }

    if (step.type === StepType.RANDOM_CHOICE) {
      setWheelSegments(
        shuffle([...step.movies]).map((m, i) => ({
          id: m.id,
          title: m.title,
          backgroundColor: i % 2 === 0 ? "#2f2f2f" : "#212121",
        }))
      );

      isWheelStarted.current = false;

      const startSpinning = () => {
        spinningWheelRef.current.startSpinning(30, 4);
        playWheel();
      };

      const interval = setInterval(() => {
        if (isWheelStarted.current === true) return;

        isWheelStarted.current = true;

        clearInterval(interval);
        startSpinning();
      }, 1000);
    }

    if (step.type === StepType.VIEWERS_CHOICE) {
      playViewersChoice();
    }

    if (step.type === StepType.STREAMER_CHOICE) {
      const i = getRandomInt(0, 2);

      if (i === 0) playOhMy();
      if (i === 1) playThreeHundred();
    }
  }, [stepIndex, step.type]);

  let isNextButtonDisabled = false;

  // TODO: button doesn't updates after ssr when initial movies are set
  // if (step.type === StepType.ADD_MOVIES) {
  //   if (step.movies.filter((m) => m.title).length < 2) {
  //     isNextButtonDisabled = true;
  //   }
  // }

  if (step.type === StepType.SHOW_WINNER) {
    isNextButtonDisabled = true;
  }

  if (
    step.type === StepType.VIEWERS_CHOICE ||
    step.type === StepType.STREAMER_CHOICE ||
    step.type === StepType.RANDOM_CHOICE
  ) {
    if (selectedMovieId === null) {
      isNextButtonDisabled = true;
    }
  }

  const showMoviesList =
    step.type !== StepType.RANDOM_CHOICE && step.type !== StepType.SHOW_WINNER;

  const handleNextButton = () => {
    if (step.type === StepType.ADD_MOVIES) {
      if (step.movies.filter((m) => m.title).length < 3) return;

      playBegin();
      nextStep();

      setTimeout(() => {
        if (currentStepType.current === StepType.START_TOURNAMENT) {
          nextStep();
        }
      }, 10000);

      return;
    }

    nextStep(selectedMovieId);
    setSelectedMovieId(null);
  };

  const handleVolumeChange = (v: number) => {
    const normalizedVolume = v / 100;

    setVolume(normalizedVolume);

    if (audioElemRef.current) {
      audioElemRef.current.volume = normalizedVolume;
    }
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
        ref={audioRef}
      />
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        gravity={0.05}
      />
    </Box>
  );

  const renderMainInfo = () => (
    <>
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

  return (
    <>
      <Typography
        variant="h3"
        textAlign="center"
        sx={{ position: "relative", mt: 1, mb: 2, fontWeight: 300 }}
      >
        Фильмовый турнир
        <VolumeControl
          sx={{ position: "absolute", right: 0, top: 16, width: 120 }}
          onChange={handleVolumeChange}
        />
      </Typography>

      <Box sx={{ mb: 2, height: 568 }}>
        {showMoviesList && renderMoviesList()}
        {step.type === StepType.RANDOM_CHOICE && renderSpinningWheel()}
        {step.type === StepType.SHOW_WINNER && renderWinner()}
      </Box>

      {renderMainInfo()}
    </>
  );
};

export default Tournament;
