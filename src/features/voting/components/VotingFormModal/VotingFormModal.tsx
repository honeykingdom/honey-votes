import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { UpdateVotingDto, VotingOptionType } from "features/api/types";
import {
  VOTING_ALLOWED_VOTING_OPTIONS_TYPES_DEFAULT,
  VOTING_CAN_MANAGE_VOTES_DEFAULT,
  VOTING_CAN_MANAGE_VOTING_OPTIONS_DEFAULT,
  VOTING_OPTIONS_LIMIT_DEFAULT,
  VOTING_USER_TYPES_PARAMS_DEFAULT,
} from "features/api/apiConstants";
import VotingForm from "./VotingForm";

export const VOTING_DEFAULT: UpdateVotingDto = {
  title: "",
  description: "",
  canManageVotes: VOTING_CAN_MANAGE_VOTES_DEFAULT,
  canManageVotingOptions: VOTING_CAN_MANAGE_VOTING_OPTIONS_DEFAULT,
  permissions: VOTING_USER_TYPES_PARAMS_DEFAULT,
  allowedVotingOptionTypes: VOTING_ALLOWED_VOTING_OPTIONS_TYPES_DEFAULT,
  votingOptionsLimit: VOTING_OPTIONS_LIMIT_DEFAULT,
};

type Props = {
  open: boolean;
  title: string;
  cancelButtonText: string;
  submitButtonText: string;
  defaultValues?: UpdateVotingDto;
  onSubmit: (voting: UpdateVotingDto) => void;
  onClose: () => void;
};

const VotingFormModal = ({
  open,
  title,
  cancelButtonText,
  submitButtonText,
  defaultValues = VOTING_DEFAULT,
  onSubmit,
  onClose,
}: Props) => {
  const useFormReturn = useForm<UpdateVotingDto>({
    defaultValues,
  });
  const { getValues } = useFormReturn;

  const handleSubmit = () => {
    const values = getValues();
    const allowedVotingOptionTypes = [];

    if ((values.allowedVotingOptionTypes as any)[VotingOptionType.Custom]) {
      allowedVotingOptionTypes.push(VotingOptionType.Custom);
    }
    if (
      (values.allowedVotingOptionTypes as any)[VotingOptionType.KinopoiskMovie]
    ) {
      allowedVotingOptionTypes.push(VotingOptionType.KinopoiskMovie);
    }
    if ((values.allowedVotingOptionTypes as any)[VotingOptionType.IgdbGame]) {
      allowedVotingOptionTypes.push(VotingOptionType.IgdbGame);
    }

    values.allowedVotingOptionTypes = allowedVotingOptionTypes;

    onSubmit(values);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      maxWidth="md"
      fullWidth
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
      <DialogContent dividers={true}>
        <VotingForm
          useFormReturn={useFormReturn}
          defaultValues={defaultValues}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelButtonText}</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VotingFormModal;
