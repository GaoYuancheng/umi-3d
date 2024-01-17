import React, { useState } from 'react';

import ColorPicker from '@/components/ColorPicker';

const ColorPickerPage = () => {
  return (
    <div>
      <ColorPicker
        defaultValue="#ffffff"
        onChange={(e) => {
          console.log('colorPicker', e.target.value);
        }}
      ></ColorPicker>
    </div>
  );
};

export default ColorPickerPage;
