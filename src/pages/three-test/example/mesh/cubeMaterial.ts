// @ts-nocheck
import * as THREE from 'three';

export const cubeMaterialRender = (params) => {
  const { material = {}, position = { x: 0, y: 0, z: 8 } } = params || {};
  // 方块
  const cubeSize = 4;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshBasicMaterial({
    color: '#8f4b2e',
    // wireframe: true,
    ...material,
  });
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);
  // mesh.position.set(position);
  mesh.position.z = position.z;
  mesh.position.x = position.x;
  mesh.position.y = position.y;
  return mesh;
};
