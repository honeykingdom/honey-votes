import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { UpdateVotingDto } from "features/api/apiTypes";
import { VotingOptionType } from "features/api/apiConstants";
import apiSchema from "features/api/apiSchema.json";
import VotingForm from "./VotingForm";

export const VOTING_DEFAULT: UpdateVotingDto = {
  title: "",
  description: "",
  canManageVotes: apiSchema.Voting.canManageVotes.default,
  canManageVotingOptions: apiSchema.Voting.canManageVotingOptions.default,
  permissions: apiSchema.Voting.permissions.default,
  allowedVotingOptionTypes: apiSchema.Voting.allowedVotingOptionTypes
    .default as VotingOptionType[],
  votingOptionsLimit: apiSchema.Voting.votingOptionsLimit.default,
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
