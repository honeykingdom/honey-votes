import { useEffect, useRef, useState, useCallback } from 'react';
import useSound from 'use-sound';
import { shuffle } from 'd3-array';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import SpinningWheel from 'react-spinning-canvas-wheel';
import type {
  SpinningWheelRef,
  WheelSegment,
} from 'react-spinning-canvas-wheel';

import VolumeControl from 'components/VolumeControl';
import ArrowRightIcon from 'icons/arrow-right.svg';
import getRandomInt from 'utils/getRandomInt';
import { useMeQuery } from 'features/api/apiSlice';
import MovieCard from './MovieCard';
// import MoviePicker from "./MoviePicker";
import useTournament from './useTournament';
import timingFunction from './utils/timingFunction';
import { Permissions, Step, StepType } from './tournamentTypes';
import useChatVoting from './useChatVoting';
import {
  CARD_IMAGE_WIDTH_MAP,
  DEFAULT_PERMISSIONS,
  USER_TYPES,
  WHEEL_COLORS,
} from './tournamentConstants';

const TOURNAMENT_ASSETS_URL = process.env.NEXT_PUBLIC_TOURNAMENT_ASSETS_URL;

const beginSfx = `${TOURNAMENT_ASSETS_URL}/begin.opus`;
const wheelSfx = `${TOURNAMENT_ASSETS_URL}/wheel.opus`;
const noNoNoSfx = `${TOURNAMENT_ASSETS_URL}/nonono.opus`;
const ohMySfx = `${TOURNAMENT_ASSETS_URL}/oh-my.opus`;
const threeHundredSfx = `${TOURNAMENT_ASSETS_URL}/three-hundred.opus`;
const viewersChoiceSfx = `${TOURNAMENT_ASSETS_URL}/viewers-choice.opus`;
const winnerSfx = `${TOURNAMENT_ASSETS_URL}/winner.opus`;

type StepText = {
  title: string;
  description: string;
  buttonTitle: string;
};

const STEPS_TEXT: Record<StepType, StepText> = {
  [StepType.ADD_MOVIES]: {
    title: 'Добавление фильмов',
    description: '',
    buttonTitle: 'Начать турнир',
  },
  [StepType.START_TOURNAMENT]: {
    title: 'Турнир начинается',
    description: '',
    buttonTitle: 'Пропустить вступление',
  },
  [StepType.VIEWERS_CHOICE]: {
    title: 'Зрители решают',
    description: 'Выберите фильм, который нужно убрать',
    buttonTitle: 'Далее',
  },
  [StepType.STREAMER_CHOICE]: {
    title: 'Стример решает',
    description: 'Выберите фильм, который нужно убрать',
    buttonTitle: 'Далее',
  },
  [StepType.RANDOM_CHOICE]: {
    title: 'Рандом решает',
    description: 'Выпавший в колесе вариант вылетает',
    buttonTitle: 'Далее',
  },
  [StepType.SHOW_WINNER]: {
    title: 'Победитель',
    description: '',
    buttonTitle: 'Турнир окончен',
  },
};

const getCardSize = (itemsCount: number) => {
  if (itemsCount <= 6) return 'large';

  if (itemsCount <= 8) return 'medium';

  return 'small';
};

const getPercent = (value: number, total: number) =>
  ((value / total) * 100 || 0).toFixed(2);

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

  const currentStepType = useRef<Step['type']>(step.type);
  currentStepType.current = step.type;

  const spinningWheelRef = useRef<SpinningWheelRef>(null);
  const isWheelStarted = useRef(false);

  const audioElemRef = useRef<HTMLAudioElement>();
  const audioRef = useCallback((audio: HTMLAudioElement) => {
    // eslint-disable-next-line no-param-reassign
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
  const [mode, setMode] = useState<'edit' | 'view'>('view');

  const [wheelSegments, setWheelSegments] = useState<Segment[]>([]);

  const me = useMeQuery();

  const [permissions, setPermissions] =
    useState<Permissions>(DEFAULT_PERMISSIONS);
  const chatVoting = useChatVoting(
    me.data?.login || '',
    step.movies.length,
    permissions,
  );

  useEffect(() => {
    if (step.type === StepType.ADD_MOVIES) {
      setMode('edit');
    } else {
      setMode('view');
    }

    if (step.type === StepType.RANDOM_CHOICE) {
      setWheelSegments(
        shuffle([...step.movies]).map((m, i) => ({
          id: m.id,
          title: m.title,
          backgroundColor: i % 2 === 0 ? '#2f2f2f' : '#212121',
        })),
      );

      isWheelStarted.current = false;

      const startSpinning = () => {
        spinningWheelRef.current?.startSpinning(30, 4);
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

  if (step.type === StepType.VIEWERS_CHOICE && chatVoting.isActive) {
    isNextButtonDisabled = true;
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

    nextStep(selectedMovieId!);
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
              <Box sx={{ position: 'relative' }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  component="span"
                  textAlign="center"
                  sx={{
                    position: 'absolute',
                    left: -48,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 48,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}.
                </Typography>
                <Box
                  sx={{
                    flexGrow: 1,
                    '&:before': {
                      display:
                        step.type === StepType.VIEWERS_CHOICE
                          ? 'block'
                          : 'none',
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: `${CARD_IMAGE_WIDTH_MAP[cardSize]}px`,
                      bottom: 0,
                      width: `calc(${getPercent(
                        chatVoting.votes[i],
                        chatVoting.votesCount,
                      )}% - ${CARD_IMAGE_WIDTH_MAP[cardSize]}px)`,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      pointerEvents: 'none',
                      zIndex: 1,
                    },
                    '&:after': {
                      display:
                        step.type === StepType.VIEWERS_CHOICE ? 'flex' : 'none',
                      content: `"${getPercent(
                        chatVoting.votes[i],
                        chatVoting.votesCount,
                      )}% (${chatVoting.votes[i]})"`,
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 'calc(100% + 16px)',
                      width: '128px',
                      alignItems: 'center',
                      color: 'text.secondary',
                    },
                  }}
                >
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
      <Box sx={{ position: 'relative', width: 540 }}>
        <SpinningWheel
          size={540}
          segments={wheelSegments}
          wheelColors={WHEEL_COLORS}
          // TODO: fix this
          // @ts-expect-error
          spinningWheelRef={spinningWheelRef}
          onSpinEnd={(index) => {
            setSelectedMovieId(wheelSegments[index as number].id);
            playNoNoNo();
          }}
          timingFunction={timingFunction}
        />
        <ArrowRightIcon
          style={{
            position: 'absolute',
            top: '50%',
            left: 1,
            width: 32,
            height: 32,
            transform: 'translateY(-50%)',
            fill: '#212121',
            stroke: '#fff',
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
      <audio src={winnerSfx} autoPlay ref={audioRef} />
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

  const renderChatVotingControls = () => (
    <Box
      justifyContent="center"
      sx={{
        position: 'absolute',
        top: 72,
        left: 0,
        width: 220,
      }}
    >
      <Typography component="div" variant="h6" sx={{ mb: 2 }}>
        Голосование в чате
      </Typography>

      {!me.data && (
        <Typography component="div" variant="body1">
          Войдите, чтобы включить голосование в чате
        </Typography>
      )}

      {me.data && (
        <>
          <Box sx={{ mb: 1 }}>
            <Typography component="span" variant="body2" color="text.secondary">
              Канал:
            </Typography>{' '}
            <Typography component="span" variant="body2">
              {me.data?.login}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography component="span" variant="body2" color="text.secondary">
              Всего голосов:
            </Typography>{' '}
            <Typography component="span" variant="body2">
              {chatVoting.votesCount}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography color="text.secondary" variant="body2">
              Голосовать могут:
            </Typography>
            {USER_TYPES.map(({ label, name }) => (
              <Box key={name}>
                <FormControlLabel
                  control={
                    <Checkbox size="small" checked={permissions[name]} />
                  }
                  label={
                    <Typography color="text.secondary" variant="body2">
                      {label}
                    </Typography>
                  }
                  name={name}
                  sx={{ fontSize: '0.875rem !important' }}
                  onChange={(e) =>
                    setPermissions((prev) => ({
                      ...prev,
                      // @ts-expect-error
                      [name]: e.target.checked,
                    }))
                  }
                />
              </Box>
            ))}
          </Box>
          <Button
            variant="contained"
            size="small"
            color={chatVoting.isActive ? 'error' : 'success'}
            onClick={() => {
              if (chatVoting.isActive) {
                chatVoting.stopVoting();

                const maxVotesValue = Math.max(...chatVoting.votes);
                const maxVotesCount = chatVoting.votes.filter(
                  (v) => v === maxVotesValue,
                ).length;

                if (maxVotesCount === 1) {
                  const i = chatVoting.votes.indexOf(maxVotesValue);

                  setSelectedMovieId(step.movies[i].id);
                }
              } else {
                chatVoting.startVoting();
              }
            }}
          >
            {chatVoting.isActive
              ? 'Остановить голосование'
              : 'Начать голосование'}
          </Button>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      <Typography
        variant="h3"
        textAlign="center"
        sx={{ position: 'relative', mt: 1, mb: 2, fontWeight: 300 }}
      >
        Фильмовый турнир
        <VolumeControl
          sx={{ position: 'absolute', right: 0, top: 16, width: 120 }}
          onChange={handleVolumeChange}
        />
      </Typography>

      <Box sx={{ mb: 2, height: 568 }}>
        {showMoviesList && renderMoviesList()}
        {step.type === StepType.RANDOM_CHOICE && renderSpinningWheel()}
        {step.type === StepType.SHOW_WINNER && renderWinner()}
        {step.type === StepType.VIEWERS_CHOICE && renderChatVotingControls()}
      </Box>

      {renderMainInfo()}
    </Box>
  );
};

export default Tournament;
