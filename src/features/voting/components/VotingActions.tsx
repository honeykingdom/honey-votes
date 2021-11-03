import * as R from "ramda";
import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  useDeleteVotingMutation,
  useUpdateVotingMutation,
} from "features/api/apiSlice";
import { Voting } from "features/api/types";
import ConfirmationDialog from "components/ConfirmationDialog";
import useChannelLogin from "hooks/useChannelLogin";
import VotingFormModal from "./VotingFormModal/VotingFormModal";

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
  voting: Voting;
};

const VotingActions = ({ voting }: Props) => {
  const router = useRouter();
  const login = useChannelLogin();

  const [updateVoting, updateVotingResult] = useUpdateVotingMutation();
  const [deleteVoting, deleteVotingResult] = useDeleteVotingMutation();

  const [isVotingFormOpened, setIsVotingFormOpened] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { id: votingId, canManageVotes } = voting;

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

  const disabled = updateVotingResult.isLoading || deleteVotingResult.isLoading;

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
        defaultValues={getVotingFormValues(voting)}
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