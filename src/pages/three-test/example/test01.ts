// @ts-nocheck

import * as d3 from 'd3';
import * as THREE from 'three';
import * as TWEEN from 'tween';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import chinaJson from '@/static/json/china.json';
import {
  planeMaterialRender,
  sunMaterialRender,
  cubeMaterialRender,
  chinaOutlineMeshRender,
} from './mesh';
import { shapeMaterialRender } from './mesh/shapeMaterial';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const vertexshader = `
    varying vec2 vUv;

    void main() {

        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
`;

const fragmentshader = `
    uniform sampler2D baseTexture;
    uniform sampler2D bloomTexture;

    varying vec2 vUv;

    void main() {

        gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

    }
`;

const ENTIRE_SCENE = 0,
  BLOOM_SCENE = 1;

const MapRender = (canvas) => {
  const bloomLayer = new THREE.Layers();
  bloomLayer.set(BLOOM_SCENE);

  // 1. 渲染器
  const renderer = new THREE.WebGLRenderer({ canvas });

  // 2. 透视投影相机  远平面  近平面  画布的宽高比  视野范围
  const camera = new THREE.PerspectiveCamera(40, 2, 0.2, 1000);

  // 3. 创建场景
  const scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper(5000);
  scene.add(axesHelper);

  //   const cameraHelper = new THREE.CameraHelper(camera);
  //   // 辅助线加入 场景
  //   scene.add(cameraHelper);

  // 相机位置  正上方向下看
  camera.position.set(0, 10, 50); // 相机位置
  //   camera.position.set(0, -50, 120);

  //   camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0); // 相机朝向

  // 控制相机
  const controls = new OrbitControls(camera, canvas);

  // 处理局部高亮
  const materials = {};

  const init = () => {
    // const sunMesh = sunMaterialRender();
    // const planeMesh = planeMaterialRender();
    const cubeMesh1 = cubeMaterialRender({
      material: {
        color: 'red',
      },
      position: new THREE.Vector3(6, 6, 0),
    });
    const cubeMesh = cubeMaterialRender({
      material: {
        color: 'yellow',
      },
      position: new THREE.Vector3(0, 0, 0),
    });
    cubeMesh.layers.enable(BLOOM_SCENE);
    // const cubeMesh = cubeMaterialRender();

    // const chinaOutlineMesh = chinaOutlineMeshRender();

    // const shapeMesh = shapeMaterialRender();
    // sunMesh.position.x = 10;
    // scene.add(sunMesh);
    // scene.add(planeMesh);
    scene.add(cubeMesh);
    scene.add(cubeMesh1);

    // scene.add(chinaOutlineMesh);
    // scene.add(shapeMesh);
    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85,
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0;

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture },
        },
        vertexShader: vertexshader,
        fragmentShader: fragmentshader,
        defines: {},
      }),
      'baseTexture',
    );
    finalPass.needsSwap = true;

    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);

    const render = (time) => {
      //   console.log(time);
      //   time *= 0.001;

      //   sunMesh.rotation.y = time;
      //   sunMesh.rotation.x = time;
      // 加载渲染器
      //   renderer.render(scene, camera);

      scene.traverse(darkenNonBloomed);
      bloomComposer.render();
      controls.update();

      scene.traverse(restoreMaterial);

      finalComposer.render();
      //   composer.render();
      // 开始动画
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  };

  const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

  function darkenNonBloomed(obj) {
    console.log('obj', obj);
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
      // 没有使用高亮图层  存储材质
      materials[obj.uuid] = obj.material;
      // 颜色改成黑色
      obj.material = darkMaterial;
    }
  }

  function restoreMaterial(obj) {
    if (materials[obj.uuid]) {
      obj.material = materials[obj.uuid];
      delete materials[obj.uuid];
    }
  }

  return {
    init,
  };
};

export default MapRender;
