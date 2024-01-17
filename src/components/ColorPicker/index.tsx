import React, { useEffect, useRef, useState } from 'react';

// import { ChromePicker } from 'react-color';

// import ColorPicker from '@rc-component/color-picker';
// import '@rc-component/color-picker/assets/index.css';

interface Props {
  defaultValue: string;
  onChange: (e) => void;
}

const ColorPicker: React.FC<Props> = ({ onChange, defaultValue }) => {
  const [selectedColor, setSelectedColor] = useState(defaultValue);

  const inputDom = useRef<HTMLInputElement>();

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    onChange(e);
  };

  return (
    <input
      ref={inputDom}
      value={selectedColor}
      type="color"
      onChange={handleColorChange}
    />
  );
};

export default ColorPicker;
