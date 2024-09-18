import { useCallback, useEffect, useRef, useState } from "react";

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "min" | "max" | "step"
> & {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
};

const NumberInputField = ({ value, onChange, ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { step, min, max } = props;
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const validateValue = useCallback(
    (value: number) => {
      const clampedValue = Math.min(Math.max(value, min), max);
      const validIntegerValue = Number.isInteger(clampedValue)
        ? clampedValue
        : Math.round(clampedValue);
      return validIntegerValue;
    },
    [min, max]
  );

  const submitChange = useCallback(
    (newValue: number) => {
      onChange(validateValue(newValue));
    },
    [onChange, validateValue]
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
      if (newValue === rounded + step || newValue === rounded - step) {
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
          e.preventDefault();
          submitChange(inputValue);
          clearFocus();
          break;
        case "Escape":
          e.preventDefault();
          submitChange(value);
          clearFocus();
          break;
        case "ArrowUp":
        case "ArrowDown":
          e.preventDefault();
          const direction = e.key === "ArrowUp" ? 1 : -1;
          const newValue = inputValue + direction * step;
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
      {...props}
      ref={inputRef}
      type="number"
      value={inputValue.toString()}
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
    />
  );
};

export { NumberInputField };
