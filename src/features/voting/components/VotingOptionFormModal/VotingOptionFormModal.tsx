import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
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
  onSubmit: (votingOption: VotingOptionDefaultValues) => void;
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
  const useFormReturn = useForm<VotingOptionDefaultValues>({ defaultValues });
  const { setValue, getValues } = useFormReturn;

  useEffect(() => {
    setValue("type", allowedVotingOptionTypes[0]);
  }, [allowedVotingOptionTypes]);

  // TODO: refactor this
  const handleSubmit = () => {
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
      const url = values[VotingOptionType.IgdbGame].slug;
      const slug = url.replace("https://www.igdb.com/games/", "").trim();

      body = {
        type: VotingOptionType.IgdbGame,
        [VotingOptionType.IgdbGame]: { slug },
      };
    }

    onSubmit(body);
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
          defaultValues={defaultValues}
          allowedVotingOptionTypes={allowedVotingOptionTypes}
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

export default VotingOptionFormModal;
