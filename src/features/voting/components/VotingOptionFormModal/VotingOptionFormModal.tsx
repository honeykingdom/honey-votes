import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { CreateVotingOptionDto } from "features/api/apiTypes";
import { VotingOptionType } from "features/api/apiConstants";
import VotingOptionForm from "./VotingOptionForm";

export type VotingOptionDefaultValues = Omit<CreateVotingOptionDto, "votingId">;

type Props = {
  open: boolean;
  title: string;
  cancelButtonText: string;
  submitButtonText: string;
  allowedVotingOptionTypes: VotingOptionType[];
  defaultValues?: VotingOptionDefaultValues;
  onSubmit: (votingOption: VotingOptionDefaultValues) => void | Promise<void>;
  onClose: () => void;
};

const VotingOptionFormModal = ({
  open,
  title,
  cancelButtonText,
  submitButtonText,
  allowedVotingOptionTypes,
  defaultValues = { type: VotingOptionType.Custom },
  onClose,
  onSubmit,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const useFormReturn = useForm<VotingOptionDefaultValues>({ defaultValues });
  const { setValue, getValues, resetField } = useFormReturn;

  useEffect(() => {
    setValue("type", allowedVotingOptionTypes[0]);
  }, [allowedVotingOptionTypes]);

  useEffect(() => {
    if (open) {
      resetField(`${VotingOptionType.IgdbGame}.slug`);
      resetField(`${VotingOptionType.KinopoiskMovie}.id`);
    }
  }, [open]);

  // TODO: refactor this
  const handleSubmit = async () => {
    const values = getValues();
    let body: VotingOptionDefaultValues;

    if (values.type === VotingOptionType.Custom) {
      body = {
        type: VotingOptionType.Custom,
        [VotingOptionType.Custom]: values[VotingOptionType.Custom],
      };
    }

    if (values.type === VotingOptionType.KinopoiskMovie) {
      body = {
        type: VotingOptionType.KinopoiskMovie,
        [VotingOptionType.KinopoiskMovie]:
          values[VotingOptionType.KinopoiskMovie],
      };
    }

    if (values.type === VotingOptionType.IgdbGame) {
      body = {
        type: VotingOptionType.IgdbGame,
        [VotingOptionType.IgdbGame]: values[VotingOptionType.IgdbGame],
      };
    }

    setIsLoading(true);

    await onSubmit(body);

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
      <DialogContent dividers={true} sx={{ minHeight: 320 }}>
        <VotingOptionForm
          useFormReturn={useFormReturn}
          allowedVotingOptionTypes={allowedVotingOptionTypes}
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

export default VotingOptionFormModal;
