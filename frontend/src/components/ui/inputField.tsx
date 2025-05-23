import React from 'react';

const InputField = ({
  type = 'text',
  placeholder = '',
  value,
  name,
  className = '',
  style = {},
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      style={{ backgroundColor: 'transparent', ...style }}
      className={`w-full px-6 py-3 font-bold text-white placeholder-gray-400 
        border border-black 
        rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl 
        rounded-br-none opacity-70 transition-colors 
        focus:outline-none focus:ring-2 focus:ring-red-500 ${className}`}
    />
  );
};

export default InputField;