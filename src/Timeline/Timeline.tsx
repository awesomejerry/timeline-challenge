import { useState } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { DEFAULT_DURATION, PlayControls } from "./PlayControls";
import { SyncScroll } from "./SyncScroll";

export const Timeline = () => {
  // FIXME: performance concerned
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [scrollLeft, setScrollLeft] = useState(0);

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls
        time={time}
        setTime={setTime}
        duration={duration}
        setDuration={setDuration}
      />
      <Ruler
        time={time}
        setTime={setTime}
        duration={duration}
        setDuration={setDuration}
      />
      <TrackList />
      <KeyframeList duration={duration} />
      <Playhead time={time} scrollLeft={scrollLeft} />
      <SyncScroll setScrollLeft={setScrollLeft} />
    </div>
  );
};
