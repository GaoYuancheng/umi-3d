import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import _ from 'lodash';
import { layoutData } from './data';

import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';

const resizeHandles = ['se'];

const generateLayout = (resizeHandles) => {
  return _.map(_.range(0, 25), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: Math.round(Math.random() * 5) * 2,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05,
      resizeHandles,
    };
  });
};

// const layout = {
//   lg: generateLayout(resizeHandles),
// };

// const layout = {
//   lg: [
//     { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
//     { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
//     { i: 'c', x: 4, y: 0, w: 1, h: 2 },
//   ],
// };
// console.log('layout', layout);
const generateDOM = () => {
  return layoutData.lg.map((l, i) => {
    return (
      <div
        key={i}
        className={l.static ? 'static' : ''}
        style={{
          background: '#ccc',
          border: '1px solid black',
        }}
      >
        {l.static ? (
          <span
            className="text"
            title="This item is static and cannot be removed or resized."
          >
            Static - {i}
          </span>
        ) : (
          <span className="text">{i}</span>
        )}
      </div>
    );
  });
};
const ResponsiveGridLayout = WidthProvider(Responsive);

const ReactGridLayout = () => {
  return (
    <ResponsiveGridLayout
      // {...this.props}
      layouts={layoutData}
      // onBreakpointChange={this.onBreakpointChange}
      // onLayoutChange={this.onLayoutChange}
      // onDrop={this.onDrop}
      // WidthProvider option
      measureBeforeMount={false}
      // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
      // and set `measureBeforeMount={true}`.
      // useCSSTransforms={this.state.mounted}
      // compactType={this.state.compactType}
      // preventCollision={!this.state.compactType}
    >
      {generateDOM()}
    </ResponsiveGridLayout>
  );
};

export default ReactGridLayout;
