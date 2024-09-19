import { fireEvent, render, screen } from "@testing-library/react";
import { KeyframeList, PlayControls, Playhead, Ruler } from "../Timeline";
import { SyncScroll } from "../Timeline/SyncScroll";
import { useState } from "react";

describe("Playhead", () => {
  it("Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling", () => {
    const TestApp = () => {
      const [time, setTime] = useState(0);
      const [duration, setDuration] = useState(2000);
      const [scrollLeft, setScrollLeft] = useState(0);
      return (
        <>
          <Ruler
            time={time}
            setTime={setTime}
            duration={duration}
            setDuration={setDuration}
          />
          <KeyframeList duration={duration} />
          <Playhead time={time} scrollLeft={scrollLeft} />
          <SyncScroll setScrollLeft={setScrollLeft} />
        </>
      );
    };
    render(<TestApp />);

    const ruler = screen.getByTestId("ruler") as HTMLDivElement;
    fireEvent.scroll(ruler, { target: { scrollLeft: 100 } });
    const keyframeList = screen.getByTestId("keyframe-list") as HTMLDivElement;
    const playhead = screen.getByTestId("playhead") as HTMLDivElement;
    expect(keyframeList.scrollLeft).toBe(100);
    expect(playhead.style.transform).toBe("translateX(calc(-100px - 50%))");
  });

  it("Playhead maintains its relative position during horizontal scrolling", () => {
    const TestApp = () => {
      const [time, setTime] = useState(0);
      const [duration, setDuration] = useState(2000);
      const [scrollLeft, setScrollLeft] = useState(0);
      return (
        <>
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
          <KeyframeList duration={duration} />
          <Playhead time={time} scrollLeft={scrollLeft} />
          <SyncScroll setScrollLeft={setScrollLeft} />
        </>
      );
    };
    render(<TestApp />);

    const playhead = screen.getByTestId("playhead") as HTMLDivElement;
    const currentTimeInput = screen.getByTestId(
      "current-time-input"
    ) as HTMLInputElement;
    currentTimeInput.focus();
    fireEvent.change(currentTimeInput, { target: { value: "500" } });
    fireEvent.keyDown(currentTimeInput, { key: "Enter", code: "Enter" });
    expect(playhead.style.transform).toBe("translateX(calc(500px - 50%))");

    const ruler = screen.getByTestId("ruler") as HTMLDivElement;
    fireEvent.scroll(ruler, { target: { scrollLeft: 200 } });
    expect(playhead.style.transform).toBe("translateX(calc(300px - 50%))");
  });

  it("Playhead is visible only when within the Timeline's visible area, using the hidden attribute when completely out of view", () => {
    const TestApp = () => {
      const [time, setTime] = useState(0);
      const [duration, setDuration] = useState(2000);
      const [scrollLeft, setScrollLeft] = useState(0);
      return (
        <>
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
          <KeyframeList duration={duration} />
          <Playhead time={time} scrollLeft={scrollLeft} />
          <SyncScroll setScrollLeft={setScrollLeft} />
        </>
      );
    };
    render(<TestApp />);

    const playhead = screen.getByTestId("playhead") as HTMLDivElement;
    const currentTimeInput = screen.getByTestId(
      "current-time-input"
    ) as HTMLInputElement;
    currentTimeInput.focus();
    fireEvent.change(currentTimeInput, { target: { value: "200" } });
    fireEvent.keyDown(currentTimeInput, { key: "Enter", code: "Enter" });

    const ruler = screen.getByTestId("ruler") as HTMLDivElement;
    fireEvent.scroll(ruler, { target: { scrollLeft: 300 } });
    expect(getComputedStyle(playhead).display).toBe("none");
    fireEvent.scroll(ruler, { target: { scrollLeft: 200 } });
    expect(getComputedStyle(playhead).display).toBe("block");
  });
});
