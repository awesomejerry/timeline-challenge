import { useCallback } from "react";
import { NumberInputField } from "./NumberInputField/NumberInputField";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
};

export const PlayControls = ({ time, setTime }: PlayControlsProps) => {
  // TODO: implement time <= maxTime

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
          max={2000}
          step={10}
          value={time}
          onChange={onTimeChange}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <input
          className="bg-gray-700 px-1 rounded"
          type="number"
          data-testid="duration-input"
          min={100}
          max={2000}
          step={10}
          defaultValue={2000}
        />
        Duration
      </fieldset>
    </div>
  );
};
