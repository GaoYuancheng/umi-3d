import React, { useState } from 'react';

//@ts-ignore
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

export function colorToRgba(hex: string, opacity: number) {
  return `rgba(${parseInt(`0x${hex.slice(1, 3)}`)},${parseInt(
    `0x${hex.slice(3, 5)}`,
  )},${parseInt(`0x${hex.slice(5, 7)}`)},${opacity})`;
}

export function colorRGBToHex(color: string) {
  const rgb = color.split(',');
  const r = parseInt(rgb[0].split('(')[1]);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2].split(')')[0]);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const initColor = 'rgba(200,200,200,.5)';
const initAlpha = 50;
// const initColor = 'rgba(250, 250, 250, 0.5)';

const ColorPickerPage = () => {
  const [color, setColor] = useState(initColor);
  const [alpha, setAlpha] = useState(initAlpha);
  return (
    <div>
      <ColorPicker
        color={color}
        // colorValue={color}
        alpha={alpha}
        onChange={(color: any) => {
          console.log('color', color);
          setColor(color.color);
          setAlpha(color.alpha);
        }}
        placement="topRight"
      />
    </div>
  );
};

export default ColorPickerPage;
