import { useState } from "react";
import { Box, Slider } from "@material-ui/core";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";

type Props = {
  initialVolume?: number;
  sx?: any;
  onChange?: (volume: number) => void;
};

const renderIcon = (volume: number, muted: boolean) => {
  if (muted || volume === 0) return <VolumeOffIcon />;
  if (volume < 50) return <VolumeDown />;
  if (volume >= 50) return <VolumeUp />;
};

const VolumeControl = ({
  initialVolume = 50,
  sx = {},
  onChange = () => {},
}: Props) => {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState<number>(initialVolume);

  const handleToggleMute = () => {
    setMuted((prev) => !prev);
    onChange(muted ? volume : 0);
  };

  return (
    <Box display="flex" alignItems="center" sx={{ width: 200, ...sx }}>
      <Box
        display="flex"
        alignItems="center"
        sx={{ mr: 2, cursor: "pointer" }}
        onClick={handleToggleMute}
      >
        {renderIcon(volume, muted)}
      </Box>
      <Slider
        value={muted ? 0 : volume}
        min={0}
        max={100}
        step={10}
        disabled={muted}
        onChange={(_, newVolume) => {
          setVolume(newVolume as number);
          onChange(newVolume as number);
        }}
      />
    </Box>
  );
};

export default VolumeControl;
