import { FormGroup, TextField } from "@mui/material";

const VotingOptionForm = () => {
  return (
    <>
      <FormGroup sx={{ mb: 2 }}>
        <TextField id="standard-basic" label="Название" variant="outlined" />
      </FormGroup>
    </>
  );
};

export default VotingOptionForm;
