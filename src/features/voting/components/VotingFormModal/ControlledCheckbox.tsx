import { UseFormRegister } from "react-hook-form";
import { Checkbox, Switch } from "@mui/material";

type Props = {
  name: string;
  register: UseFormRegister<any>;
  defaultChecked?: boolean;
  Component?: typeof Checkbox | typeof Switch;
};

const ControlledCheckbox = ({
  name,
  register,
  defaultChecked = false,
  Component = Checkbox,
  ...outerRest
}: Props) => {
  const { ref, ...rest } = register(name);

  return (
    <Component
      {...outerRest}
      {...rest}
      inputRef={ref}
      defaultChecked={defaultChecked}
    />
  );
};

export default ControlledCheckbox;
