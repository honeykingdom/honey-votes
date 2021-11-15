import { FormControl, InputLabel, Select } from "@mui/material";
import { Control, Controller } from "react-hook-form";

type Props = {
  id: string;
  name: string;
  label: string;
  control: Control<any, any>;
  children: any;
};

const FormControlSelect = ({ id, name, label, control, children }: Props) => (
  <FormControl variant="standard" sx={{ display: "flex" }}>
    <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          label={label}
          labelId={`${id}-select-label`}
          id={`${id}-select`}
          size="small"
          {...field}
        >
          {children}
        </Select>
      )}
    />
  </FormControl>
);

export default FormControlSelect;
