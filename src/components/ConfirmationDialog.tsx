import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  handleClose: () => void;
  handleYes: () => void;
};

const ConfirmationDialog = ({
  open,
  title,
  description,
  handleYes,
  handleClose,
}: Props) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {description}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Нет</Button>
      <Button
        onClick={() => {
          handleYes();
          handleClose();
        }}
        autoFocus
      >
        Да
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;
