import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  useCreateVoteMutation,
  useDeleteVoteMutation,
  useDeleteVotingOptionMutation,
  useMeQuery,
  useMeRolesQuery,
  useVotingQuery,
} from 'features/api/apiSlice';
import { VotingOption } from 'features/api/apiTypes';
import { API_ERRORS } from 'features/api/apiConstants';
import ConfirmationDialog from 'components/ConfirmationDialog';
import useChannelLogin from 'hooks/useChannelLogin';
import getCanDeleteVotingOption from '../utils/getCanDeleteVotingOption';
import getCanVote from '../utils/getCanVote';

const IGDB_IMAGES_BASE_URL = 'https://images.igdb.com/igdb/image/upload';

const getAuthorName = (votingOption?: VotingOption): string =>
  votingOption?.authorData?.displayName ||
  votingOption?.authorData?.login ||
  '';

const getIgdbImageSrc = (id: string) =>
  `${IGDB_IMAGES_BASE_URL}/t_cover_small/${id}.jpg`;
const getIgdbImageSrcSet = (id: string) =>
  `${IGDB_IMAGES_BASE_URL}/t_cover_small/${id}.jpg, ${IGDB_IMAGES_BASE_URL}/t_cover_small_2x/${id}.jpg 2x`;

// 1 min
const VOTE_INTERVAL = 60 * 1000;

type Props = {
  votingOption: VotingOption;
  isActive: boolean;
  fullVotesValue: number | string;
  lastVoteTimestampRef: React.MutableRefObject<number>;
};

const VotingOptionCard = ({
  votingOption,
  isActive,
  fullVotesValue = 0,
  lastVoteTimestampRef,
}: Props) => {
  const {
    id,
    votingId,
    cardTitle,
    cardSubtitle,
    cardDescription,
    cardImageUrl,
    cardImageId,
    cardUrl,
  } = votingOption;

  const [isDeleteVoteDialogOpen, setIsDeleteVoteDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const login = useChannelLogin();
  const me = useMeQuery();
  const meRoles = useMeRolesQuery({ login: login! }, { skip: !login });
  const voting = useVotingQuery(votingId, { skip: !votingId });
  const [createVote, createVoteResult] = useCreateVoteMutation();
  const [deleteVote, deleteVoteResult] = useDeleteVoteMutation();
  const [deleteVotingOption] = useDeleteVotingOptionMutation();

  const authorName = getAuthorName(votingOption);

  const canVote = getCanVote(voting.data, me.data, meRoles.data);

  const canDeleteVotingOption = getCanDeleteVotingOption(
    voting.data,
    votingOption,
    fullVotesValue,
    me.data,
    meRoles.data,
  );

  let imageUrl = cardImageUrl || '';
  let imageSrcSet = '';

  if (cardImageId) {
    imageUrl = getIgdbImageSrc(cardImageId);
    imageSrcSet = getIgdbImageSrcSet(cardImageId);
  }

  const handleCardClick = async () => {
    if (lastVoteTimestampRef.current + VOTE_INTERVAL > Date.now()) {
      enqueueSnackbar('Вы голосуете слишком быстро', { variant: 'error' });

      return;
    }

    if (createVoteResult.isLoading || deleteVoteResult.isLoading) return;

    if (isActive) {
      try {
        await deleteVote(id).unwrap();

        enqueueSnackbar('Голос удалён', { variant: 'success' });
      } catch (e: any) {
        enqueueSnackbar(
          API_ERRORS[e.data?.message] || 'Не удалось удалить голос',
          { variant: 'error' },
        );
      }
    } else {
      try {
        await createVote(id).unwrap();

        // eslint-disable-next-line no-param-reassign
        lastVoteTimestampRef.current = Date.now();

        enqueueSnackbar('Ваш голос защитан', { variant: 'success' });
      } catch (e: any) {
        enqueueSnackbar(
          API_ERRORS[e.data?.message] || 'Не удалось проголосовать',
          { variant: 'error' },
        );
      }
    }
  };

  const handleDeleteVotingOption = async () => {
    try {
      await deleteVotingOption(id).unwrap();

      enqueueSnackbar('Вариант удалён', { variant: 'success' });
    } catch (e: any) {
      enqueueSnackbar(
        API_ERRORS[e.data?.message] || 'Не удалось удалить вариант',
        { variant: 'error' },
      );
    }
  };

  const renderCardImage = () =>
    imageUrl ? (
      <CardActionArea
        component="a"
        target="_blank"
        href={cardUrl}
        sx={{ width: 'auto' }}
      >
        <CardMedia
          component="img"
          sx={{
            width: 72,
            height: 96,
            objectFit: 'cover',
            flexShrink: 0,
            bgcolor: 'background.paper',
          }}
          src={imageUrl}
          srcSet={imageSrcSet}
          alt={cardTitle}
        />
      </CardActionArea>
    ) : (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 72,
          height: 96,
          flexShrink: 0,
          bgcolor: 'background.paper',
        }}
      >
        <InsertDriveFileIcon sx={{ fontSize: 32 }} />
      </Box>
    );

  const renderCardContent = () => (
    <CardContent
      sx={{
        display: 'flex',
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        height: '100%',
        '&:last-child': { pb: { xs: 0.5, sm: 1 } },
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="h2"
          display="flex"
          alignItems="center"
          sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.5rem' } }}
        >
          {cardTitle}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {cardSubtitle}
        </Typography>
        {cardDescription && (
          <Typography variant="body2" color="text.secondary">
            {cardDescription}
          </Typography>
        )}
      </Box>
      <Typography
        variant="body2"
        component="div"
        color="text.secondary"
        sx={{
          display: { xs: 'none', md: 'inline-flex' },
          alignItems: 'center',
          mt: 'auto',
        }}
      >
        Предложил:
        <Box sx={{ ml: 0.5, display: 'inline-flex', alignItems: 'center' }}>
          <Avatar
            src={votingOption.authorData?.avatarUrl}
            sx={{ width: 24, height: 24 }}
          >
            {authorName[0].toUpperCase()}
          </Avatar>
          &nbsp;
          {authorName}
        </Box>
      </Typography>
    </CardContent>
  );

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexGrow: 1,
          bgcolor: isActive ? 'rgba(102, 187, 106, 0.53)' : undefined,
        }}
        variant="elevation"
      >
        {renderCardImage()}
        {canVote ? (
          <CardActionArea
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={handleCardClick}
          >
            {renderCardContent()}
          </CardActionArea>
        ) : (
          <Box sx={{ flexGrow: 1 }}>{renderCardContent()}</Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            order: -1,
            px: 1,
            width: { xs: 40, sm: 64 },
          }}
        >
          <Typography
            component="div"
            variant="h5"
            color="text.secondary"
            align="center"
          >
            {fullVotesValue}
          </Typography>
        </Box>
        {canDeleteVotingOption && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: { xs: 32, sm: 48 },
              ml: 'auto',
            }}
          >
            <IconButton
              size="small"
              color="error"
              onClick={() => setIsDeleteVoteDialogOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Card>

      <ConfirmationDialog
        open={isDeleteVoteDialogOpen}
        title="Удалить вариант для голосования"
        description="Вы действительно хотите удалить этот вариант для голосования?"
        handleClose={() => setIsDeleteVoteDialogOpen(false)}
        handleYes={handleDeleteVotingOption}
      />
    </>
  );
};

export default React.memo(VotingOptionCard);
