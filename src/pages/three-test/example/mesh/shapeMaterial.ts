// @ts-nocheck
import * as THREE from 'three';
import checkerPng from '@/static/img/checker.png';
import grassPng from '@/static/img/grass.png';

export const shapeMaterialRender = () => {
  const length = 2,
    width = 4;

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, width);
  shape.lineTo(length, width);
  shape.lineTo(length, 0);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    // steps: 2,
    depth: 2,
    // bevelEnabled: true,
    // bevelThickness: 1,
    // bevelSize: 1,
    // bevelOffset: 0,
    // bevelSegments: 1,
  };

  const shape_c = new THREE.Path();
  shape_c.moveTo(0, 0);
  shape_c.lineTo(0, width);
  shape_c.lineTo(length, width);
  shape_c.lineTo(length, 0);
  shape_c.lineTo(0, 0);
  shape.holes.push(shape_c);

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshBasicMaterial({ color: 0xeeffcc });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};
