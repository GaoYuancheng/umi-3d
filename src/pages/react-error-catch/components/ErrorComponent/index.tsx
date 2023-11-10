import React from 'react';
import { Button } from 'antd';

const ErrorComponent = () => {
  // throw new Error('ss');
  return (
    <div>
      {ss}
      <Button
        onClick={() => {
          throw new Error('ss');
          // console.log(a.s);
        }}
      >
        show Error
      </Button>
    </div>
  );
};

export default ErrorComponent;
