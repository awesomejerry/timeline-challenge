import { useCallback, useRef, useState } from "react";

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  value: number;
  onChange: (value: number) => void;
};

const NumberInputField = ({ value, onChange, ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { step, min } = props;
  const [inputValue, setInputValue] = useState(value);

  const submitChange = useCallback(
    (newValue: number) => {
      const minValidValue = newValue < 0 ? Number(min) : newValue;
      const validIntegerValue = Number.isInteger(minValidValue)
        ? minValidValue
        : Math.round(minValidValue);
      onChange(validIntegerValue);
    },
    [onChange, min]
  );

  const selectInput = useCallback(() => {
    const input = inputRef.current;
    if (input) {
      input.select();
    }
  }, []);

  const clearFocus = useCallback(() => {
    const input = inputRef.current;
    if (input) {
      input.blur();
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === "") {
        submitChange(value);
        return;
      }
      const newValue = Number(e.target.value);
      // TODO: a temporary solution to detect native step buttons pressed
      const rounded =
        newValue !== step ? Math.round(inputValue / 10) * 10 : inputValue;
      if (
        newValue === rounded + Number(step) ||
        newValue === rounded - Number(step)
      ) {
        submitChange(newValue);
        selectInput();
      }
      setInputValue(newValue);
    },
    [submitChange, value, inputValue, selectInput]
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          submitChange(inputValue);
          clearFocus();
          break;
        case "Escape":
          setInputValue(value);
          clearFocus();
          break;
        case "ArrowUp":
        case "ArrowDown":
          const direction = e.key === "ArrowUp" ? 1 : -1;
          const newValue = inputValue + direction * Number(step);
          submitChange(newValue);
          break;
      }
    },
    [submitChange, inputValue, step, clearFocus]
  );

  const handleInputFocus = useCallback(() => {
    selectInput();
  }, [selectInput]);

  const handleInputBlur = useCallback(() => {
    submitChange(inputValue);
  }, [submitChange, inputValue]);

  return (
    <input
      ref={inputRef}
      type="number"
      value={inputValue.toString()}
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      {...props}
    />
  );
};

export { NumberInputField };
