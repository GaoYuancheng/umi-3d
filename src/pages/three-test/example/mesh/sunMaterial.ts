// @ts-nocheck
import * as THREE from 'three';

export const sunMaterialRender = () => {
  // 创建球体
  const sphereGeometry = new THREE.SphereGeometry(
    2, // 半径
    1, // 经度上的切片数
    1, // 纬度上的切片数
  );
  // 材质 emissive 不被光影响的颜色
  // MeshPhongMaterial 一种用于具有镜面高光的光泽表面的材质。
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 'red',
  });
  // 网格
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  return sunMesh;
};
