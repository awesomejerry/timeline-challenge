import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberInputField } from "./NumberInputField";

describe("NumberInputField", () => {
  it("The displayed value updates immediately while typing, but onChange is not triggered until input is confirmed", () => {
    const mockOnChange = jest.fn();
    const initialValue = 0;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe(initialValue.toString());

    fireEvent.change(input, { target: { value: "100" } });
    expect(input.value).toBe("100");
    expect(mockOnChange).not.toHaveBeenCalled();

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockOnChange).toHaveBeenCalledWith(100);
  });

  it("Clicking outside the input field removes focus and changes the value", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 100;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: "150" } });
    expect(mockOnChange).not.toHaveBeenCalled();

    await userEvent.click(document.body);
    expect(input).not.toHaveFocus();
    expect(mockOnChange).toHaveBeenCalledWith(150);
  });

  it("Clicking on the native step buttons immediately changes the value", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 150;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "160" } });
    expect(mockOnChange).toHaveBeenCalledWith(160);

    // NOTE: internal state has changed
    fireEvent.change(input, { target: { value: "150" } });
    expect(mockOnChange).toHaveBeenLastCalledWith(150);
  });

  it("Pressing up arrow or down arrow keys immediately changes the value", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 150;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);

    await userEvent.keyboard("{arrowup}");
    expect(mockOnChange).toHaveBeenCalledWith(160);

    // NOTE: it's a mock function, so the value prop (initialValue) is not changed
    await userEvent.keyboard("{arrowdown}");
    expect(mockOnChange).toHaveBeenLastCalledWith(140);
  });

  it("Entire text is selected when the input field gains focus", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 150;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;
    input.focus();
    // TODO: verify the current input selection matches initialValue
  });

  it("Entire text is selected after using the native step buttons", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 150;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "160" } });
    // TODO: verify the current input selection matches initialValue

    fireEvent.change(input, { target: { value: "150" } });
    // TODO: verify the current input selection matches initialValue
  });

  it("Entire text is selected after using the up arrow or down arrow keys", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 150;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);

    await userEvent.keyboard("{arrowup}");
    // TODO: verify the current input selection matches initialValue

    await userEvent.keyboard("{arrowdown}");
    // TODO: verify the current input selection matches initialValue
  });

  it("Pressing Enter confirms the new value and removes focus", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 150;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;
    input.focus();
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(input).not.toHaveFocus();
  });

  it(" Pressing Escape reverts to the original value and removes focus", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 150;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: "100" } });
    expect(input.value).toBe("100");
    fireEvent.keyDown(input, { key: "Escape", code: "Escape" });
    expect(input).not.toHaveFocus();
    expect(input.value).toBe(initialValue.toString());
  });

  it("Leading zeros are automatically removed", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 150;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: "0100" } });
    expect(input.value).toBe("100");
  });

  it("Negative values are automatically adjusted to the minimum allowed value", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 100;
    const min = 10;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={min}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: "-100" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockOnChange).toHaveBeenCalledWith(min);
  });

  it("Decimal values are automatically rounded to the nearest integer", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 100;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: "100.5" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockOnChange).toHaveBeenCalledWith(101);
    fireEvent.change(input, { target: { value: "100.4" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockOnChange).toHaveBeenCalledWith(100);
  });

  it("Invalid inputs (non-numeric) revert to the previous valid value", async () => {
    const mockOnChange = jest.fn();
    const initialValue = 100;

    render(
      <NumberInputField
        data-testid="number-input-field"
        value={initialValue}
        onChange={mockOnChange}
        min={0}
        max={2000}
        step={10}
      />
    );

    const input = screen.getByTestId("number-input-field") as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: "123abc" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockOnChange).toHaveBeenCalledWith(100);
  });
});
