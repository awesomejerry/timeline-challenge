import React, { useCallback, useEffect, useRef, useState } from "react";
import { tenMultipliers } from "../../utils";

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "min" | "max" | "step"
> & {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  "data-testid": string;
};

const NumberInputField = React.memo(({ value, onChange, ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { step, min, max } = props;
  const [inputValue, setInputValue] = useState(value);

  const reportInvalid = useCallback((invalid: boolean) => {
    if (invalid) {
      inputRef.current?.classList.add("text-red-500");
    } else {
      inputRef.current?.classList.remove("text-red-500");
    }
  }, []);

  useEffect(() => {
    reportInvalid(inputValue !== validateValue(inputValue));
  }, [inputValue, reportInvalid]);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  const validateValue = useCallback(
    (value: number) => {
      const clampedValue = Math.min(Math.max(value, min), max);
      const validIntegerValue = Number.isInteger(clampedValue)
        ? clampedValue
        : Math.round(clampedValue);
      return tenMultipliers(validIntegerValue);
    },
    [min, max]
  );

  const submitChange = useCallback(
    (value: number) => {
      const validValue = validateValue(value);
      onChange(validValue);
      if (validValue !== inputValue) {
        setInputValue(validValue);
      }
    },
    [onChange, validateValue, inputValue, setInputValue]
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
});

export { NumberInputField };
