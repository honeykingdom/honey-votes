import * as R from "ramda";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  useDeleteVotingMutation,
  useUpdateVotingMutation,
  useVotingQuery,
} from "features/api/apiSlice";
import ConfirmationDialog from "components/ConfirmationDialog";
import useChannelLogin from "hooks/useChannelLogin";
import VotingFormModal from "./VotingFormModal/VotingFormModal";
import { Voting } from "features/api/types";

const getVotingFormValues = R.pick<keyof Voting>([
  "title",
  "description",
  "canManageVotes",
  "canManageVotingOptions",
  "permissions",
  "allowedVotingOptionTypes",
  "votingOptionsLimit",
]);

type Props = {
  votingId: number;
};

const VotingActions = ({ votingId }: Props) => {
  const router = useRouter();
  const login = useChannelLogin();

  const voting = useVotingQuery(votingId, { skip: !votingId });
  const [updateVoting, updateVotingResult] = useUpdateVotingMutation();
  const [deleteVoting, deleteVotingResult] = useDeleteVotingMutation();

  const [isVotingFormOpened, setIsVotingFormOpened] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const canManageVotes = voting.data?.canManageVotes;

  const handleToggleVoting = () =>
    updateVoting({ votingId, body: { canManageVotes: !canManageVotes } });

  const handleEditVoting = async (body: Partial<Voting>) => {
    await updateVoting({ votingId, body });

    setIsVotingFormOpened(false);
  };

  const handleDeleteVoting = async () => {
    await deleteVoting(votingId);

    router.push(`/${login}/voting`);
  };

  const disabled =
    voting.isLoading ||
    voting.isFetching ||
    updateVotingResult.isLoading ||
    deleteVotingResult.isLoading;

  return (
    <Box sx={{ display: "flex" }}>
      <Button
        color="primary"
        startIcon={canManageVotes ? <LockIcon /> : <LockOpenIcon />}
        disabled={disabled}
        onClick={handleToggleVoting}
      >
        {canManageVotes ? "Закрыть голосование" : "Открыть голосование"}
      </Button>
      {/* {canManageVotes && (
        <Button size="small" color="primary">
        {canManageVotingOptions
          ? "Закрыть создание вариантов"
          : "Открыть создание вариантов"}
          </Button>
        )} */}

      <Button
        startIcon={<EditIcon />}
        disabled={disabled}
        onClick={() => setIsVotingFormOpened(true)}
      >
        Редактировать
      </Button>
      <Button
        startIcon={<DeleteIcon />}
        disabled={disabled}
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        Удалить
      </Button>

      <VotingFormModal
        open={isVotingFormOpened}
        title="Редактировать голосование"
        cancelButtonText="Отмена"
        submitButtonText="Сохранить"
        defaultValues={getVotingFormValues(voting.data)}
        onClose={() => setIsVotingFormOpened(false)}
        onSubmit={handleEditVoting}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title="Удаление голосования"
        description="Вы действительно хотите удалить голосование?"
        handleClose={() => setIsDeleteDialogOpen(false)}
        handleYes={handleDeleteVoting}
      />
    </Box>
  );
};

export default VotingActions;
