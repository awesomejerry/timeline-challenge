import { fireEvent, render, screen } from "@testing-library/react";
import { Ruler } from "../Timeline";

describe("Ruler", () => {
  it("Clicking or dragging on the Ruler updates the Current Time and Playhead position", () => {
    const mockSetTime = jest.fn();
    const mockSetDuration = jest.fn();
    //
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

  it("Horizontal scrolling of the Ruler is synchronized with the Keyframe List", () => {});
});
