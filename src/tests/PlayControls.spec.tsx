import { fireEvent, render, screen } from "@testing-library/react";
import {
  DEFAULT_DURATION,
  MAX_DURATION,
  MIN_DURATION,
  PlayControls,
} from "../Timeline/PlayControls";
import userEvent from "@testing-library/user-event";

describe("PlayControls", () => {
  it("Current Time is always between 0ms and the Duration", () => {
    const mockSetTime = jest.fn();
    const mockSetDuration = jest.fn();

    render(
      <PlayControls
        time={0}
        setTime={mockSetTime}
        duration={2000}
        setDuration={mockSetDuration}
      />
    );

    const input = screen.getByTestId("current-time-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: -1 } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockSetTime).toHaveBeenCalledWith(0);

    fireEvent.change(input, { target: { value: `${DEFAULT_DURATION + 1}` } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockSetTime).toHaveBeenCalledWith(DEFAULT_DURATION);
  });

  it("Current Time adjusts if it exceeds the newly set Duration", () => {
    const mockSetTime = jest.fn();
    const mockSetDuration = jest.fn();

    render(
      <PlayControls
        time={1000}
        setTime={mockSetTime}
        duration={2000}
        setDuration={mockSetDuration}
      />
    );

    const input = screen.getByTestId("duration-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: 500 } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockSetTime).toHaveBeenCalledWith(500);
  });

  it("Duration is always between 100ms and 6000ms", () => {
    const mockSetTime = jest.fn();
    const mockSetDuration = jest.fn();

    render(
      <PlayControls
        time={1000}
        setTime={mockSetTime}
        duration={2000}
        setDuration={mockSetDuration}
      />
    );

    const input = screen.getByTestId("duration-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: `${MIN_DURATION - 1}` } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(input.value).toBe(`${MIN_DURATION}`);

    fireEvent.change(input, { target: { value: `${MAX_DURATION + 1}` } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(input.value).toBe(`${MAX_DURATION}`);
  });

  it("Current Time and Duration are always multiples of 10ms", () => {
    const mockSetTime = jest.fn();
    const mockSetDuration = jest.fn();

    render(
      <PlayControls
        time={1000}
        setTime={mockSetTime}
        duration={2000}
        setDuration={mockSetDuration}
      />
    );

    const input = screen.getByTestId("current-time-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "103" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockSetTime).toHaveBeenCalledWith(100);

    fireEvent.change(input, { target: { value: "107" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockSetTime).toHaveBeenCalledWith(110);
  });

  it("Current Time and Duration are always positive integers", () => {
    const mockSetTime = jest.fn();
    const mockSetDuration = jest.fn();

    render(
      <PlayControls
        time={1000}
        setTime={mockSetTime}
        duration={2000}
        setDuration={mockSetDuration}
      />
    );

    let input = screen.getByTestId("current-time-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "-100" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockSetTime).toHaveBeenCalledWith(0);

    input = screen.getByTestId("duration-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "-100" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(input.value).toBe(`${MIN_DURATION}`);
  });

  it("Playhead position updates only after specific actions on Current Time input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)", async () => {
    const mockSetTime = jest.fn();
    const mockSetDuration = jest.fn();

    render(
      <PlayControls
        time={1000}
        setTime={mockSetTime}
        duration={2000}
        setDuration={mockSetDuration}
      />
    );

    const input = screen.getByTestId("current-time-input") as HTMLInputElement;

    input.focus();
    fireEvent.change(input, { target: { value: "500" } });
    expect(mockSetTime).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockSetTime).toHaveBeenLastCalledWith(500);

    input.focus();
    await userEvent.keyboard("{arrowup}");
    expect(mockSetTime).toHaveBeenLastCalledWith(510);

    input.focus();
    fireEvent.change(input, { target: { value: "520" } });
    input.blur();
    expect(mockSetTime).toHaveBeenLastCalledWith(520);
  });
});
