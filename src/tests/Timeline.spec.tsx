import { fireEvent, render, screen } from "@testing-library/react";
import { Timeline } from "../Timeline";
import userEvent from "@testing-library/user-event";

describe("Timeline", () => {
  const user = userEvent.setup();
  it("Work as expected", async () => {
    render(<Timeline />);

    const currentTimeInput = screen.getByTestId(
      "current-time-input"
    ) as HTMLInputElement;
    const durationInput = screen.getByTestId(
      "duration-input"
    ) as HTMLInputElement;
    const playhead = screen.getByTestId("playhead") as HTMLDivElement;
    const ruler = screen.getByTestId("ruler") as HTMLDivElement;
    const rulerBar = screen.getByTestId("ruler-bar") as HTMLDivElement;
    const trackList = screen.getByTestId("track-list") as HTMLDivElement;
    const keyframeList = screen.getByTestId("keyframe-list") as HTMLDivElement;

    expect(currentTimeInput.value).toBe("0");
    expect(durationInput.value).toBe("2000");

    await user.click(currentTimeInput);
    await user.keyboard("100");
    await user.keyboard("{enter}");
    expect(currentTimeInput).not.toHaveFocus();
    expect(currentTimeInput.value).toBe("100");
    expect(playhead.style.transform).toBe("translateX(calc(100px - 50%))");

    await user.click(currentTimeInput);
    await user.keyboard("200");
    await user.click(document.body);
    expect(currentTimeInput.value).toBe("200");

    await user.click(durationInput);
    await user.keyboard("1000");
    await user.keyboard("{enter}");
    expect(getComputedStyle(rulerBar).width).toBe("1000px");

    await user.type(durationInput, "50");
    await user.keyboard("{enter}");
    expect(durationInput.value).toBe("100");
    expect(currentTimeInput.value).toBe("100");

    fireEvent.click(rulerBar, { clientX: 300 });
    expect(playhead.style.transform).toBe("translateX(calc(300px - 50%))");

    fireEvent.mouseDown(rulerBar, { clientX: 400 });
    fireEvent.mouseMove(rulerBar, { clientX: 500 });
    fireEvent.mouseUp(rulerBar);
    expect(playhead.style.transform).toBe("translateX(calc(500px - 50%))");

    fireEvent.scroll(ruler, { target: { scrollLeft: 300 } });
    expect(playhead.style.transform).toBe("translateX(calc(200px - 50%))");
    expect(keyframeList.scrollLeft).toBe(300);

    fireEvent.scroll(trackList, { target: { scrollTop: 100 } });
    expect(keyframeList.scrollTop).toBe(100);
    fireEvent.scroll(keyframeList, { target: { scrollTop: 200 } });
    expect(trackList.scrollTop).toBe(200);
  });
});
