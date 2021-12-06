import { useTranslation } from 'react-i18next';
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
}: Props) => {
  const [t] = useTranslation();

  return (
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
        <Button onClick={handleClose}>{t('no')}</Button>
        <Button
          onClick={() => {
            handleYes();
            handleClose();
          }}
          autoFocus
        >
          {t('yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
