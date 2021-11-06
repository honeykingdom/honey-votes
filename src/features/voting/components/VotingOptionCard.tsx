import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { VotingOption } from "features/api/types";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  useCreateVoteMutation,
  useDeleteVoteMutation,
  useDeleteVotingOptionMutation,
  useMeQuery,
  useMeRolesQuery,
  useUserVotesQuery,
  useVotingOptionsQuery,
  useVotingQuery,
} from "features/api/apiSlice";
import useChannelLogin from "hooks/useChannelLogin";
import getCanDeleteVotingOption from "../utils/getCanDeleteVotingOption";
import getCanVote from "../utils/getCanVote";

const getAuthorName = (votingOption?: VotingOption): string =>
  (votingOption as any).author?.displayName ||
  (votingOption as any).author?.login ||
  "";

type Props = {
  votingOption: VotingOption;
};

const VotingOptionCard = ({ votingOption }: Props) => {
  const {
    id,
    votingId,
    cardTitle,
    cardSubtitle,
    cardDescription,
    cardImageUrl,
    cardUrl,
    fullVotesValue,
  } = votingOption;

  const login = useChannelLogin();
  const me = useMeQuery();
  const meRoles = useMeRolesQuery({ login }, { skip: !login });
  const voting = useVotingQuery(votingId, { skip: !votingId });
  const votingOptions = useVotingOptionsQuery(votingId, { skip: !votingId });
  const userVotes = useUserVotesQuery(
    { votingId, authorId: me.data?.id },
    { skip: !me.data }
  );
  const [createVote] = useCreateVoteMutation();
  const [deleteVote] = useDeleteVoteMutation();
  const [deleteVotingOption] = useDeleteVotingOptionMutation();

  const authorName = getAuthorName(votingOption);
  const canDeleteVotingOption = getCanDeleteVotingOption(
    voting.data,
    votingOption,
    me.data,
    meRoles.data
  );
  const canVote = getCanVote(voting.data, me.data, meRoles.data);
  const isActive = userVotes.data?.some((vote) => vote.votingOptionId === id);

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
    <CardContent sx={{ display: "flex", py: 1, height: "100%" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="h2"
          display="flex"
          alignItems="center"
          sx={{ flexGrow: 1 }}
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
          display: "inline-flex",
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
          onClick={() => (isActive ? deleteVote(id) : createVote(id))}
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
          width: 64,
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
            width: 48,
            ml: "auto",
          }}
        >
          <IconButton
            size="small"
            color="error"
            onClick={() => deleteVotingOption(id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Card>
  );
};

export default VotingOptionCard;
