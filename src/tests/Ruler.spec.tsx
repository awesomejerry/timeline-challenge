import { fireEvent, render, screen } from "@testing-library/react";
import { KeyframeList, PlayControls, Ruler } from "../Timeline";
import { SyncScroll } from "../Timeline/SyncScroll";
import { useState } from "react";

describe("Ruler", () => {
  it("Clicking or dragging on the Ruler updates the Current Time and Playhead position", () => {
    const mockSetTime = jest.fn();
    const mockSetDuration = jest.fn();

    render(
      <Ruler
        time={0}
        setTime={mockSetTime}
        duration={2000}
        setDuration={mockSetDuration}
      />
    );

    const area = screen.getByTestId("ruler-bar") as HTMLInputElement;
    fireEvent.click(area, { clientX: 100 });
    expect(mockSetTime).toHaveBeenCalledWith(100);

    fireEvent.click(area, { clientX: 234 });
    expect(mockSetTime).toHaveBeenLastCalledWith(230);

    fireEvent.mouseDown(area, { clientX: 100 });
    fireEvent.mouseMove(area, { clientX: 300 });
    fireEvent.mouseUp(area);
    expect(mockSetTime).toHaveBeenLastCalledWith(300);
  });

  it("Horizontal scrolling of the Ruler is synchronized with the Keyframe List", () => {
    const mockSetTime = jest.fn();
    const mockSetDuration = jest.fn();

    render(
      <>
        <Ruler
          time={0}
          setTime={mockSetTime}
          duration={2000}
          setDuration={mockSetDuration}
        />
        <KeyframeList duration={2000} />
        <SyncScroll />
      </>
    );

    const ruler = screen.getByTestId("ruler") as HTMLDivElement;
    fireEvent.scroll(ruler, { target: { scrollLeft: 100 } });
    const keyframeList = screen.getByTestId("keyframe-list") as HTMLDivElement;
    expect(keyframeList.scrollLeft).toBe(100);

    fireEvent.scroll(keyframeList, { target: { scrollLeft: 200 } });
    expect(ruler.scrollLeft).toBe(200);
  });

  it("Ruler length visually represents the total Duration (1ms = 1px)", () => {
    const mockSetTime = jest.fn();
    const mockSetDuration = jest.fn();

    render(
      <Ruler
        time={0}
        setTime={mockSetTime}
        duration={1234}
        setDuration={mockSetDuration}
      />
    );

    const rulerBar = screen.getByTestId("ruler-bar") as HTMLDivElement;
    expect(getComputedStyle(rulerBar).width).toBe("1234px");
  });

  it("Ruler length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)", () => {
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
          <Ruler
            time={0}
            setTime={mockSetTime}
            duration={duration}
            setDuration={setDuration}
          />
        </>
      );
    };

    render(<TestApp />);

    const durationInput = screen.getByTestId(
      "duration-input"
    ) as HTMLInputElement;
    durationInput.focus();
    fireEvent.change(durationInput, { target: { value: "3000" } });
    const rulerBar = screen.getByTestId("ruler-bar") as HTMLDivElement;
    expect(getComputedStyle(rulerBar).width).toBe("2000px");
    fireEvent.keyDown(durationInput, { key: "Enter", code: "Enter" });
    expect(getComputedStyle(rulerBar).width).toBe("3000px");
  });
});
