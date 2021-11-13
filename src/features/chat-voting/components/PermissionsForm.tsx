import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ChatVoting } from "features/api/apiTypes";
import { SyntheticEvent } from "react";
import { OnChatVotingChange } from "../types";

type Props = {
  permissions: ChatVoting["permissions"];
  disabled?: boolean;
  onChange: OnChatVotingChange;
};

const PermissionsForm = ({
  permissions,
  disabled = false,
  onChange = () => {},
}: Props) => {
  const { mod, vip, sub, viewer, subMonthsRequired, subTierRequired } =
    permissions;
  const checkboxes = [
    { name: "mod", label: "Модеры", value: mod },
    { name: "vip", label: "Випы", value: vip },
    { name: "sub", label: "Сабы", value: sub },
    { name: "viewer", label: "Зрители", value: viewer },
  ];

  const handleCheckboxChange =
    (name: string) => (e: SyntheticEvent<HTMLInputElement, Event>) => {
      const value = e.currentTarget.checked;

      onChange({ permissions: { ...permissions, [name]: value } });
    };

  return (
    <>
      <FormGroup sx={{ display: "inline-flex", flexDirection: "row" }}>
        {checkboxes.map(({ name, label, value }) => (
          <FormControlLabel
            key={name}
            control={
              <Checkbox size="small" checked={value} disabled={disabled} />
            }
            name={name}
            label={label}
            onChange={handleCheckboxChange(name)}
          />
        ))}
      </FormGroup>

      {/* <Box sx={{ mt: 2 }}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">
            Минимальный уровень подписки
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={1}
            label="Age"
            size="small"
            sx={{ width: 320 }}
            // onChange={handleChange}
          >
            <MenuItem value={1}>Тир 1</MenuItem>
            <MenuItem value={2}>Тир 2</MenuItem>
            <MenuItem value={3}>Тир 3</MenuItem>
          </Select>
        </FormControl>{" "}
        <FormControl>
          <InputLabel id="demo-simple-select-label">
            Необходимое количество месяцев подписки
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={1}
            label="Age"
            size="small"
            sx={{ width: 320 }}
            // onChange={handleChange}
          >
            {SUB_MONTHS.map(({ value, title }) => (
              <MenuItem value={value}>{title}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box> */}
    </>
  );
};

export default PermissionsForm;
