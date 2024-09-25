import React, { useRef, useEffect, ChangeEvent } from 'react';

interface AutosizeInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const AutosizeInput: React.FC<AutosizeInputProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${value.length}ch`;
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      className="inline-input"
      value={value}
      onChange={onChange}
    />
  );
};

export default AutosizeInput;
