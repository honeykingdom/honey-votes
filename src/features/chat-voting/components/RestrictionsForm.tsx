import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ChatVoting } from "features/api/types";
import { SyntheticEvent } from "react";
import { OnChatVotingChange } from "../types";

type Props = {
  restrictions: ChatVoting["restrictions"];
  disabled?: boolean;
  onChange: OnChatVotingChange;
};

const RestrictionsForm = ({
  restrictions,
  disabled = false,
  onChange = () => {},
}: Props) => {
  const { mod, vip, subTier1, subTier2, subTier3, viewer, subMonthsRequired } =
    restrictions;
  const sub = subTier1 || subTier2 || subTier3;

  const checkboxes = [
    { name: "mod", label: "Модеры", value: mod },
    { name: "vip", label: "Випы", value: vip },
    { name: "sub", label: "Сабы", value: sub },
    { name: "viewer", label: "Зрители", value: viewer },
  ];

  const handleCheckboxChange =
    (name: string) => (e: SyntheticEvent<HTMLInputElement, Event>) => {
      const value = e.currentTarget.checked;

      if (name === "sub") {
        onChange({
          restrictions: {
            ...restrictions,
            subTier1: value,
            subTier2: value,
            subTier3: value,
          },
        });
      } else {
        onChange({ restrictions: { ...restrictions, [name]: value } });
      }
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

export default RestrictionsForm;
