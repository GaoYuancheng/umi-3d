// @ts-nocheck
import * as THREE from 'three';
import * as d3 from 'd3';

import chinaOutlineJson from '@/static/json/china-outline.json';

export const lineOutlineMeshRender = (params) => {
  const { material = {}, position = { x: 0, y: 0, z: 8 } } = params || {};

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 1,
    linecap: 'round', //ignored by WebGLRenderer
    linejoin: 'round', //ignored by WebGLRenderer
    ...material,
  });

  const points = [];
  points.push(new THREE.Vector3(-10, 0, position.z));
  points.push(new THREE.Vector3(0, 10, position.z));
  points.push(new THREE.Vector3(10, 0, position.z));

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(lineGeometry, lineMaterial);

  return line;
};
