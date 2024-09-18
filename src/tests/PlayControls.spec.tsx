import { fireEvent, render, screen } from "@testing-library/react";
import {
  DEFAULT_DURATION,
  MAX_DURATION,
  MIN_DURATION,
  PlayControls,
} from "../Timeline/PlayControls";

describe("PlayControls", () => {
  it("Current Time is always between 0ms and the Duration", () => {
    const mockSetTime = jest.fn();

    render(<PlayControls time={0} setTime={mockSetTime} />);

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

    render(<PlayControls time={1000} setTime={mockSetTime} />);

    const input = screen.getByTestId("duration-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: 500 } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockSetTime).toHaveBeenCalledWith(500);
  });

  it("Duration is always between 100ms and 6000ms", () => {
    const mockSetTime = jest.fn();

    render(<PlayControls time={1000} setTime={mockSetTime} />);

    const input = screen.getByTestId("duration-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: `${MIN_DURATION - 1}` } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(input.value).toBe(`${MIN_DURATION}`);

    fireEvent.change(input, { target: { value: `${MAX_DURATION + 1}` } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(input.value).toBe(`${MAX_DURATION}`);
  });
});
