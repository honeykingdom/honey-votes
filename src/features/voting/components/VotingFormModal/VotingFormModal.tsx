import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
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
  showValues: apiSchema.Voting.showValues.default,
  allowedVotingOptionTypes: apiSchema.Voting.allowedVotingOptionTypes
    .default as VotingOptionType[],
  votingOptionsLimit: apiSchema.Voting.votingOptionsLimit.default,
};

export type VotingFormParams = Omit<
  UpdateVotingDto,
  "allowedVotingOptionTypes"
> & {
  allowedVotingOptionTypes: { [key in VotingOptionType]: boolean };
};

const transformToFormValues = (values: UpdateVotingDto): VotingFormParams => ({
  ...values,
  allowedVotingOptionTypes: {
    [VotingOptionType.Custom]: values.allowedVotingOptionTypes.includes(
      VotingOptionType.Custom
    ),
    [VotingOptionType.KinopoiskMovie]: values.allowedVotingOptionTypes.includes(
      VotingOptionType.KinopoiskMovie
    ),
    [VotingOptionType.IgdbGame]: values.allowedVotingOptionTypes.includes(
      VotingOptionType.IgdbGame
    ),
  },
});

const transformToValues = (values: VotingFormParams): UpdateVotingDto => {
  const allowedVotingOptionTypes = [];

  if (values.allowedVotingOptionTypes[VotingOptionType.Custom]) {
    allowedVotingOptionTypes.push(VotingOptionType.Custom);
  }
  if (values.allowedVotingOptionTypes[VotingOptionType.KinopoiskMovie]) {
    allowedVotingOptionTypes.push(VotingOptionType.KinopoiskMovie);
  }
  if (values.allowedVotingOptionTypes[VotingOptionType.IgdbGame]) {
    allowedVotingOptionTypes.push(VotingOptionType.IgdbGame);
  }

  return {
    ...values,
    allowedVotingOptionTypes,
  };
};

type Props = {
  open: boolean;
  title: string;
  cancelButtonText: string;
  submitButtonText: string;
  defaultValues?: UpdateVotingDto;
  onSubmit: (voting: UpdateVotingDto) => void | Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);
  const useFormReturn = useForm<VotingFormParams>({
    defaultValues: transformToFormValues(defaultValues),
  });
  const { reset, getValues } = useFormReturn;

  useEffect(() => {
    if (open) {
      reset(transformToFormValues(defaultValues));
    }
  }, [open]);

  const handleSubmit = async () => {
    const values = getValues();

    setIsLoading(true);

    await onSubmit(transformToValues(values));

    setIsLoading(false);
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
        <Button
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSubmit}
        >
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VotingFormModal;
