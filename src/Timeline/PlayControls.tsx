import { useCallback, useState } from "react";
import { NumberInputField } from "./NumberInputField/NumberInputField";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
};

const MIN_DURATION = 100;
const MAX_DURATION = 6000;
const STEP = 10;

export const PlayControls = ({ time, setTime }: PlayControlsProps) => {
  const [duration, setDuration] = useState(2000);

  const handleDurationChange = useCallback(
    (value: number) => {
      setDuration(value);
    },
    [setDuration]
  );

  // TODO: implement time <= maxTime
  // NOTE: implemented in NumberInputField
  const onTimeChange = useCallback(
    (value: number) => {
      setTime(value);
    },
    [setTime]
  );

  return (
    <div
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 
 px-2"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        Current
        <NumberInputField
          className="bg-gray-700 px-1 rounded"
          data-testid="current-time-input"
          min={0}
          max={MAX_DURATION}
          step={STEP}
          value={time}
          onChange={onTimeChange}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <NumberInputField
          className="bg-gray-700 px-1 rounded"
          data-testid="duration-input"
          min={MIN_DURATION}
          max={MAX_DURATION}
          step={STEP}
          value={duration}
          onChange={handleDurationChange}
        />
        Duration
      </fieldset>
    </div>
  );
};
