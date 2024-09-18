import { Segment } from "./Segment";

type KeyframeListProps = {
  duration: number;
};

export const KeyframeList = ({ duration }: KeyframeListProps) => {
  // TODO: implement scroll sync with `Ruler` and `TrackList`

  return (
    <div
      className="px-4 min-w-0 overflow-auto"
      data-testid="keyframe-list"
      data-sync-scroll="horizontal|vertical"
    >
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
    </div>
  );
};
