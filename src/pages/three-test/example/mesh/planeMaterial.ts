// @ts-nocheck
import * as THREE from 'three';
import checkerPng from '@/static/img/checker.png';
import grassPng from '@/static/img/grass.png';

export const planeMaterialRender = () => {
  // 地面 平铺
  const planeSize = 20;
  const loader = new THREE.TextureLoader();
  const texture = loader.load(checkerPng);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  const repeats = planeSize / 2;
  texture.repeat.set(repeats, repeats);
  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -0.5;
  return mesh;
};
