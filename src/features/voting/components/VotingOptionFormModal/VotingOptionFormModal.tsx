import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import VotingOptionForm from "./VotingOptionForm";

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
};

const VotingOptionFormModal = ({ title, open, onClose }: Props) => {
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
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          <VotingOptionForm />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={onClose}>
          Создать голосование
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VotingOptionFormModal;
