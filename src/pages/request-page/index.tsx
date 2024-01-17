import { Button } from 'antd';
import React, { useEffect } from 'react';
import request from 'umi-request';

const index = () => {
  const init = async () => {
    const formData = new FormData();
    formData.append('file', 'ss');

    const res = await request('/ss', {
      method: 'POST',
      data: formData,
    });

    // const res = await fetch('http://localhost:3000/test');
    // const data = await res.json();
    // console.log(data);
  };

  useEffect(() => {
    init();
    window.gyc = 'gyc';
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          init();
        }}
      >
        init
      </Button>
    </div>
  );
};

export default index;
