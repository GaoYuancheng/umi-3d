import React, { useState } from 'react';
import MapRender from './map';
import './index.less';
import { useEffect } from 'react';

const index: React.FC<any> = () => {
  const [mapObj, setMapObj] = useState<any>({});

  const init = () => {
    const mapRender = new MapRender({});
    mapRender.init();
  };

  useEffect(() => {
    init();
    // return () => {
    //   mapObj.destroyed();
    // };
  }, []);

  return (
    <>
      <div id="label"></div>
      <div id="container" style={{ height: '100%' }}></div>
    </>
  );
};

export default index;
