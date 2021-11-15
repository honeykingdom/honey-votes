import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  useCreateVoteMutation,
  useDeleteVoteMutation,
  useDeleteVotingOptionMutation,
  useMeQuery,
  useMeRolesQuery,
  useVotesQuery,
  useVotingQuery,
} from "features/api/apiSlice";
import { VotingOption } from "features/api/apiTypes";
import ConfirmationDialog from "components/ConfirmationDialog";
import useChannelLogin from "hooks/useChannelLogin";
import useSnackbar from "features/snackbar/useSnackbar";
import getCanDeleteVotingOption from "../utils/getCanDeleteVotingOption";
import getCanVote from "../utils/getCanVote";

const getAuthorName = (votingOption?: VotingOption): string =>
  (votingOption as any).author?.displayName ||
  (votingOption as any).author?.login ||
  "";

type Props = {
  votingOption: VotingOption;
  isActive: boolean;
  fullVotesValue: number | string;
};

const VotingOptionCard = ({
  votingOption,
  isActive,
  fullVotesValue = 0,
}: Props) => {
  const {
    id,
    votingId,
    cardTitle,
    cardSubtitle,
    cardDescription,
    cardImageUrl,
    cardUrl,
  } = votingOption;

  const [isDeleteVoteDialogOpen, setIsDeleteVoteDialogOpen] = useState(false);
  const snackbar = useSnackbar();

  const login = useChannelLogin();
  const me = useMeQuery();
  const meRoles = useMeRolesQuery({ login }, { skip: !login });
  const voting = useVotingQuery(votingId, { skip: !votingId });
  const [createVote] = useCreateVoteMutation();
  const [deleteVote] = useDeleteVoteMutation();
  const [deleteVotingOption] = useDeleteVotingOptionMutation();

  const authorName = getAuthorName(votingOption);

  const canVote = getCanVote(voting.data, me.data, meRoles.data);

  const canDeleteVotingOption = getCanDeleteVotingOption(
    voting.data,
    votingOption,
    fullVotesValue,
    me.data,
    meRoles.data
  );

  const handleCardClick = async () => {
    if (isActive) {
      const result = await deleteVote(id);

      // @ts-expect-error
      if (result.error) {
        snackbar({
          message: "Не удалось удалить голос",
          variant: "error",
        });
      } else {
        snackbar({
          message: "Голос удалён",
          variant: "success",
        });
      }
    } else {
      const result = await createVote(id);

      // @ts-expect-error
      if (result.error) {
        snackbar({
          message: "Не удалось проголосовать",
          variant: "error",
        });
      } else {
        snackbar({
          message: "Ваш голос защитан",
          variant: "success",
        });
      }
    }
  };

  const handleDeleteVotingOption = async () => {
    const result = await deleteVotingOption(id);

    // @ts-expect-error
    if (result.error) {
      snackbar({
        message: "Не удалось удалить вариант",
        variant: "error",
      });
    } else {
      snackbar({
        message: "Вариант удалён",
        variant: "success",
      });
    }
  };

  const renderCardImage = () =>
    cardImageUrl ? (
      <CardActionArea
        component="a"
        target="_blank"
        href={cardUrl}
        sx={{ width: "auto" }}
      >
        <CardMedia
          component="img"
          sx={{
            width: 72,
            height: 96,
            objectFit: "cover",
            flexShrink: 0,
            bgcolor: "background.paper",
          }}
          image={cardImageUrl}
          alt={cardTitle}
        />
      </CardActionArea>
    ) : (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 72,
          height: 96,
          flexShrink: 0,
          bgcolor: "background.paper",
        }}
      >
        <InsertDriveFileIcon sx={{ fontSize: 32 }} />
      </Box>
    );

  const renderCardContent = () => (
    <CardContent
      sx={{
        display: "flex",
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        height: "100%",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="h2"
          display="flex"
          alignItems="center"
          sx={{ flexGrow: 1, fontSize: { xs: "1rem", sm: "1.5rem" } }}
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
          display: { xs: "none", md: "inline-flex" },
          alignItems: "center",
          mt: "auto",
        }}
      >
        Предложил:
        <Box sx={{ ml: 0.5, display: "inline-flex", alignItems: "center" }}>
          <Avatar
            src={(votingOption as any).author?.avatarUrl}
            sx={{ mr: 0.5, width: 24, height: 24 }}
          >
            {authorName[0].toUpperCase()}
          </Avatar>{" "}
          {authorName}
        </Box>
      </Typography>
    </CardContent>
  );

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexGrow: 1,
          bgcolor: isActive ? "#66bb6a88" : undefined,
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: { xs: 32, sm: 48 },
              ml: "auto",
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
