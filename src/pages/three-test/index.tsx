import React, { useEffect, useState } from 'react';
import MapRender from './example/bloom';
// import MapRender from './example/outline';
// import MapRender from './example/test01';
// import MapRender from './example/test01';

const ThreeTest: React.FC<any> = () => {
  const [map, setMap] = useState<any>({});
  useEffect(() => {
    console.log('ss');
    const canvas = document.getElementById('threeCanvas');
    const map = MapRender(canvas);
    map.init();
    console.log('map', map);
    setMap(map);
  }, []);
  return (
    <div>
      <canvas
        style={{ margin: 'auto', display: 'block' }}
        id="threeCanvas"
        width="500px"
        height="500px"
      ></canvas>
      {/* <button
        onClick={() => {
          map.move();
        }}
      >
        move
      </button> */}
    </div>
  );
};

export default ThreeTest;
