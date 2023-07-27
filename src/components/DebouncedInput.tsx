import React from 'react';
import 'regenerator-runtime/runtime';

import { FaPaperPlane, FaMicrophone } from 'react-icons/fa';

interface DebouncedInputProps {
  value: string | number;
  onChange: (value: string | number) => void;
  send: () => void | Promise<void>;
  debounce?: number;
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  send,
  debounce = 500,
  ...props
}: DebouncedInputProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FaPaperPlane className="text-gray-600 w-5 h-5" />
        </div>
        <input
          type="text"
          className="w-full block p-1.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          id="message-box"
          {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </>
  );
};

export default DebouncedInput;
