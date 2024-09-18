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
  const { step } = props;
  const [inputValue, setInputValue] = useState(value);

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
      const value = Number(e.target.value);
      // TODO: a temporary solution to detect native step buttons pressed
      const rounded =
        value !== step ? Math.round(inputValue / 10) * 10 : inputValue;
      if (
        value === rounded + Number(step) ||
        value === rounded - Number(step)
      ) {
        onChange(value);
        selectInput();
      }
      setInputValue(value);
    },
    [onChange, inputValue, selectInput]
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          onChange(inputValue);
          clearFocus();
          break;
        case "ArrowUp":
        case "ArrowDown":
          const direction = e.key === "ArrowUp" ? 1 : -1;
          const newValue = inputValue + direction * Number(step);
          onChange(newValue);
          break;
      }
    },
    [onChange, inputValue, step, clearFocus]
  );

  const handleInputFocus = useCallback(() => {
    selectInput();
  }, [selectInput]);

  const handleInputBlur = useCallback(() => {
    onChange(inputValue);
  }, [onChange, inputValue]);

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
