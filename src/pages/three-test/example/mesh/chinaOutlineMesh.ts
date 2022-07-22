// @ts-nocheck
import * as THREE from 'three';
import * as d3 from 'd3';

import chinaOutlineJson from '@/static/json/china-outline.json';

export const chinaOutlineMeshRender = () => {
  const map = new THREE.Object3D();
  const projection = d3
    .geoMercator()
    .center([104.0, 37.5])
    .scale(100)
    .translate([0, 0]);
  chinaOutlineJson.features.forEach((elem) => {
    // 定一个省份3D对象
    const province = new THREE.Object3D();
    province.userData.isProvince = true;
    // 每个的 坐标 数组
    const coordinates = elem.geometry.coordinates;
    // 循环坐标数组
    coordinates.forEach((multiPolygon, i) => {
      multiPolygon.forEach((polygon) => {
        const shape = new THREE.Shape();
        // const shape1 = new THREE.Shape();
        // const shape1_c = new THREE.Path();
        const lineMaterial = new THREE.LineBasicMaterial({
          color: '#fff',
          linewidth: 4,
        });
        const points = [];
        for (let i = 0; i < polygon.length; i++) {
          const [x, y] = projection(polygon[i]);
          points.push(new THREE.Vector3(x, -y, 6));
          if (i === 0) {
            shape.moveTo(x, -y);
            // shape1.moveTo(x, -y);
            // shape1_c.moveTo(x, -y);
          }
          shape.lineTo(x, -y);
          // shape1.lineTo(x, -y);
          // shape1_c.lineTo(x, -y);
        }
        // shape1.holes.push(shape1_c);

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const extrudeSettings = {
          // depth: i % 2 === 0 ? 9 : 3,
          depth: 6,
          bevelEnabled: false,
        };
        // console.log('extrudeSettings', extrudeSettings, i);

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        const line = new THREE.Line(lineGeometry, lineMaterial);

        province.add(line);
      });
    });

    map.add(province);
  });

  return map;
};
