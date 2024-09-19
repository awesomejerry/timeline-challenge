import React, { useCallback } from "react";
import { NumberInputField } from "./NumberInputField/NumberInputField";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  setDuration: (time: number) => void;
};

export const MIN_DURATION = 100;
export const MAX_DURATION = 6000;
export const DEFAULT_DURATION = 2000;
const STEP = 10;

export const PlayControls = React.memo(
  ({ time, setTime, duration, setDuration }: PlayControlsProps) => {
    const handleDurationChange = useCallback(
      (value: number) => {
        setDuration(value);

        if (value < time) {
          setTime(value);
        }
      },
      [setDuration, setTime, time]
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
            max={duration}
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
  }
);
