import { fireEvent, render, screen } from "@testing-library/react";
import { TrackList, KeyframeList } from "../Timeline";
import { SyncScroll } from "../Timeline/SyncScroll";

describe("TrackList", () => {
  it("Vertical scrolling of the Track List is synchronized with the Keyframe List", () => {
    render(
      <>
        <KeyframeList duration={2000} />
        <TrackList />
        <SyncScroll />
      </>
    );

    const keyframeList = screen.getByTestId("keyframe-list") as HTMLDivElement;
    fireEvent.scroll(keyframeList, { target: { scrollTop: 100 } });
    const trackList = screen.getByTestId("track-list") as HTMLDivElement;
    expect(trackList.scrollTop).toBe(100);

    fireEvent.scroll(trackList, { target: { scrollTop: 200 } });
    expect(keyframeList.scrollTop).toBe(200);
  });
});
