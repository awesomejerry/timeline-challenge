import { fireEvent, render, screen } from "@testing-library/react";
import { TrackList, KeyframeList, Ruler, PlayControls } from "../Timeline";
import { SyncScroll } from "../Timeline/SyncScroll";
import { useState } from "react";
import userEvent from "@testing-library/user-event";

describe("KeyframeList", () => {
  it("Vertical scrolling is synchronized with the Track List", () => {
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

  it("Horizontal scrolling is synchronized with the Ruler", () => {
    const mockSetTime = jest.fn();
    const mockSetDuration = jest.fn();
    render(
      <>
        <KeyframeList duration={2000} />
        <Ruler
          time={0}
          setTime={mockSetTime}
          duration={2000}
          setDuration={mockSetDuration}
        />
        <SyncScroll />
      </>
    );

    const keyframeList = screen.getByTestId("keyframe-list") as HTMLDivElement;
    fireEvent.scroll(keyframeList, { target: { scrollLeft: 100 } });
    const ruler = screen.getByTestId("ruler") as HTMLDivElement;
    expect(ruler.scrollLeft).toBe(100);

    fireEvent.scroll(ruler, { target: { scrollLeft: 200 } });
    expect(keyframeList.scrollLeft).toBe(200);
  });

  it("Segment length visually represents the total Duration (1ms = 1px)", () => {
    render(
      <>
        <KeyframeList duration={1234} />
      </>
    );

    const segments = screen.getAllByTestId("segment");
    segments.forEach((segment) => {
      expect(getComputedStyle(segment).width).toBe("1234px");
    });
  });

  it("Segment length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)", async () => {
    const mockSetTime = jest.fn();
    const TestApp = () => {
      const [duration, setDuration] = useState(2000);
      return (
        <>
          <PlayControls
            time={0}
            setTime={mockSetTime}
            duration={duration}
            setDuration={setDuration}
          />
          <KeyframeList duration={duration} />
        </>
      );
    };

    render(<TestApp />);

    const durationInput = screen.getByTestId(
      "duration-input"
    ) as HTMLInputElement;
    durationInput.focus();
    await userEvent.keyboard("{arrowup}");
    const segments = screen.getAllByTestId("segment");
    segments.forEach((segment) => {
      expect(getComputedStyle(segment).width).toBe("2010px");
    });
  });
});
