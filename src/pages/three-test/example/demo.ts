// @ts-nocheck

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { lineOutlineMeshRender } from './mesh';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import skyPng from '@/static/img/sky.png';

const MapRender = (canvas) => {
  // 1. 渲染器
  const renderer = new THREE.WebGLRenderer({ canvas });

  // 2. 摄像机视锥体垂直视野角度 长宽比 摄像机视锥体近端面  摄像机视锥体远端面
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);

  // 3. 创建场景
  const scene = new THREE.Scene();

  // 相机位置  正上方向下看
  camera.position.set(20, 20, 50); // 相机位置

  camera.lookAt(0, 0, 0); // 相机朝向

  const addHelper = () => {
    // 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
    const axesHelper = new THREE.AxesHelper(5000);
    scene.add(axesHelper);
    // 控制相机
    const controls = new OrbitControls(camera, canvas);
  };
  // 加入物体
  const addBoxMesh = () => {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x00ff00,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 10, 10);
    scene.add(cube);
  };

  const init = () => {
    addHelper();
    addBoxMesh();

    const lineMesh = lineOutlineMeshRender({
      material: {
        color: '#fff',
        linewidth: 20,
      },
    });
    const lineMesh1 = lineOutlineMeshRender({
      material: {
        color: 'red',
      },
      position: {
        z: 20,
      },
    });
    scene.add(lineMesh);
    scene.add(lineMesh1);

    // scene.traverse((obj) => {
    //   console.log(obj);
    // });

    const render = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };
    render();
  };

  return {
    init,
  };
};

export default MapRender;
