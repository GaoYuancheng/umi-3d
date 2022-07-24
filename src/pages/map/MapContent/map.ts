// @ts-nocheck

import * as d3 from 'd3';
import * as THREE from 'three';
import * as TWEEN from 'tween';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import chinaJson from '@/static/json/china1.json';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import MapPng from '@/static/img/map.png';
import grassPng from '@/static/img/grass.png';
import {
  chinaOutlineMeshRender,
  cubeMaterialRender,
} from '@/pages/three-test/example/mesh';
import { adCodeMap } from './data';
import skyPng from '@/static/img/sky.png';
const typeList = [];

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

const highLightFilterList = ['Line', 'Mesh'];

const materials = {};

const ENTIRE_SCENE = 0,
  BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);

class MapRender {
  container = document.getElementById('container');
  lineColor = 'red';
  surfaceColor = '#fff';
  bodyColor = 'gray';
  cameraInitPosition = new THREE.Vector3(0, -50, 120);
  cameraInitLookPosition = new THREE.Vector3(0, 0, 0);
  cameraPosition = this.cameraInitPosition;
  // 第一步新建一个场景
  scene = new THREE.Scene();
  scene1 = new THREE.Scene();
  currentScene = this.scene;
  currentLevel = 1; // country province

  levelSceneMap = {
    1: this.scene,
    2: this.scene1,
  };

  constructor(props) {
    console.log('MapRender');
  }

  init() {
    // THREE.Cache.enabled = true;

    this.cubeMesh = cubeMaterialRender();
    this.cubeMesh.layers.enable(BLOOM_SCENE);
    // this.cubeMesh.visible = false;

    this.scene.add(this.cubeMesh);

    this.setScene();
    this.setCamera();
    this.setRenderer();
    // this.setHelper();
    this.setCompose();
    this.setRaycaster();
    this.loadMapData();
    this.render();
  }

  setScene() {
    const textureLoader = new THREE.TextureLoader(); // 纹理加载器
    const texture = textureLoader.load(skyPng);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // this.scene.background = texture;
  }

  setHelper() {
    const axesHelper = new THREE.AxesHelper(5000);
    const cameraHelper = new THREE.CameraHelper(this.camera);
    const helper = new THREE.CameraHelper(this.camera);
    // 辅助线加入 场景
    this.scene.add(cameraHelper);
    this.scene.add(axesHelper);
    this.scene.add(helper);
  }

  // 相机动画
  cameraMove(fromPosition, targetPoint) {
    // console.log('cameraMove', targetPoint);
    const { x, y, z } = targetPoint.point;
    const targetProvince = targetPoint.object.parent;
    const provinceInfo = targetProvince.properties;

    // 设定相机初始位置
    const coords = { ...fromPosition };

    new TWEEN.Tween(coords)
      .to({ x, y, z: 0 }, 1000) // 指定目标位置和耗时.
      .easing(TWEEN.Easing.Quadratic.Out) // 指定动画效果曲线.
      .onStart(() => {
        const v = new THREE.Vector3(x, y, 0);
        this.controls.target = v;
        this.camera.lookAt(v);
        console.log('onStart');
      })
      .onUpdate(() => {
        // 渲染时每一帧执行：设定相机位置
        this.camera.position.set(coords.x, coords.y, coords.z);
        // this.camera.position.set(obj.x, obj.y, obj.z);
        // this.camera.lookAt(0, 0, 0);
        // this.camera.lookAt(coords.x, coords.y, 0);
      })
      .onComplete(() => {
        // 动画结束后执行

        console.log('crr', provinceInfo);
        // this.clearThree(this.scene);
        // this.renderProvinceMap(provinceInfo);
        this.camera.position.set(
          this.cameraInitPosition.x,
          this.cameraInitPosition.y,
          this.cameraInitPosition.z,
        );
        this.controls.target = this.cameraInitLookPosition;
        this.camera.lookAt(this.cameraInitLookPosition);
      })
      .start(); // 即刻开启动画
    console.log('aa');
    this.renderProvinceMap(provinceInfo, this.scene1);
  }

  // 清空画布
  clearThree(obj) {
    while (obj.children.length > 0) {
      this.clearThree.bind(this, obj.children[0]);
      obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
    if (obj.texture) obj.texture.dispose();
  }

  // 加载对应省份数据
  renderProvinceMap(provinceInfo, targetScene) {
    const { adcode } = provinceInfo;
    const provinceJson = adCodeMap[adcode];
    // console.log('provinceJson', provinceJson);

    if (!provinceJson) return;
    this.currentLevel += 1;
    // this.currentScene = this.levelSceneMap[this.currentLevel];
    this.generateGeometry({
      jsondata: provinceJson,
      projectionParams: {
        scale: 300,
        center: [120.1, 30.3],
      },
      targetScene,
    });

    setTimeout(() => {
      this.currentScene = this.levelSceneMap[this.currentLevel];
      this.setCompose();

      //   this.render();
    }, 900);
  }

  // 设置高亮
  setCompose() {
    // if (this.bloomComposer) this.bloomComposer.clear();
    const renderScene = new RenderPass(this.currentScene, this.camera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85,
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 0.4;
    bloomPass.radius = 0;

    const bloomComposer = new EffectComposer(this.renderer);
    bloomComposer.renderToScreen = true;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);
    this.bloomComposer = bloomComposer;

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

    const finalComposer = new EffectComposer(this.renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);

    this.finalComposer = finalComposer;
  }

  // 搜索高亮地区
  showRegion(provinceName) {
    try {
      if (this.obj3d !== null) {
        for (const typeElement of this.lastSearch) {
          this.obj3d = this.map.children.filter(
            (item) => item.properties.name === typeElement,
          );
          this.obj3d[0].children[0].material[0].color.set('#3D479C');
          this.obj3d[0].children[0].material[1].color.set('#3D479C');
        }
        this.lastSearch = '';
      }
      // 记录上一次搜索的省份
      this.lastSearch = provinceName;
      this.obj3d = null;
      for (const typeElement of provinceName) {
        this.obj3d = this.map.children.filter(
          (item) => item.properties.name === typeElement,
        );
        this.obj3d[0].children[0].material[0].color.set('#2EA6B4');
        this.obj3d[0].children[0].material[1].color.set('#2EA6B4');
      }
    } catch (e) {
      console.log(e);
    }
  }

  // 新建透视相机
  setCamera() {
    // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.container.offsetWidth / this.container.offsetHeight,
      0.1,
      1000,
    );
    const { x, y, z } = this.cameraInitPosition;
    const { x: lookAtX, y: lookAtY, z: lookAtZ } = this.cameraInitLookPosition;
    this.camera.position.set(x, y, z);
    this.camera.lookAt(lookAtX, lookAtY, lookAtZ);

    this.camera1 = new THREE.PerspectiveCamera(
      40,
      this.container.offsetWidth / this.container.offsetHeight,
      0.1,
      1000,
    );
    this.camera1.position.set(300, 200, 30);
    this.camera1.lookAt(0, 0, 0);
  }

  // 设置渲染器
  setRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    // 设置画布的大小
    this.renderer.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight,
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // 开启阴影
    this.renderer.shadowMap.enabled = true;
    // this.renderer.autoClear = false;

    //这里其实就是canvas 画布  renderer.domElement
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // document.body.appendChild(this.renderer.domElement);
  }

  onMouseClick = () => {
    if (this.mouse.x === 0 && this.mouse.y === 0) return;
    // 通过摄像机和鼠标位置更新射线
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 算出射线与当前场景相交的对象有那些
    const intersects = this.raycaster.intersectObjects(
      this.currentScene.children,
      true,
    );

    if (intersects && intersects.length > 0) {
      // 省份层级 直接 return
      if (this.currentLevel > 1) return;
      const targetProvince = intersects.find((item) => {
        return !!item.object.parent.userData.isProvince;
      });
      if (!targetProvince) return;
      // console.log('target click', targetProvince);
      this.cameraMove(this.cameraInitPosition, targetProvince);
    } else {
      // 空白
      if (this.currentLevel > 1) {
        const lastScene = this.levelSceneMap[this.currentLevel];
        this.clearThree(lastScene);

        this.currentLevel -= 1;
        this.currentScene = this.levelSceneMap[this.currentLevel];
        this.setCompose();
        // this.render();
      }
    }
  };

  setRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.labelDom = document.getElementById('label');

    const onMouseMove = (event) => {
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

      this.mouse.x = (event.clientX / this.container.offsetWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / this.container.offsetHeight) * 2 + 1;
      this.labelDom.style.left = event.clientX + 2 + 'px';
      this.labelDom.style.top = event.clientY + 2 + 'px';
      this.transSelect();
    };

    const onMouseClick = (event) => {
      this.mouse.x = (event.clientX / this.container.offsetWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / this.container.offsetHeight) * 2 + 1;
      this.onMouseClick();
    };

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onMouseClick, false);
  }

  setLight() {
    this.ambientLight = new THREE.AmbientLight('#ff0000');
    this.currentScene.add(this.ambientLight);
  }

  materialChange(obj, type) {
    if (!obj) return;
    if (type === 'reset') {
      // if (obj.parent.position.z === 0) return;
      if (!obj.userData.active) return;
      // console.log(obj, type);

      // obj.parent.translateZ(-1);
      obj.material[0].color.set(this.surfaceColor);
      obj.userData.active = false;
    }
    if (type === 'change') {
      // 不知道为什么卸载这里不行
      // if (obj.parent.position.z === 1) return;
      // obj.parent.translateZ(1);
      // obj.material[1].color.set('#fff');
    }
  }

  // 动画
  transSelect() {
    // 初始会在x=0 和 y=0执行一次
    if (this.mouse.x === 0 && this.mouse.y === 0) return;
    // 通过摄像机和鼠标位置更新射线
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 算出射线与当前场景相交的对象有那些
    const intersects = this.raycaster
      .intersectObjects(this.currentScene.children, true)
      .filter((item) => !item.object.type.endsWith('Helper'));

    if (intersects && intersects.length > 0) {
      const targetProvince = intersects.find((item) => {
        return !!item.object.parent.userData.isProvince;
      });
      // console.log('target', targetProvince, intersects);

      if (targetProvince && targetProvince.object.material.length >= 2) {
        // this.materialChange(targetProvince.object, 'change');
        const obj = targetProvince.object;
        // if (obj.parent.position.z === 1) return;
        // obj.parent.translateZ(1);
        if (obj.userData.active) return;
        // console.log('change', obj);
        obj.material[0].color.set('red');
        obj.userData.active = true;

        this.materialChange(this.lastPick, 'reset');

        this.lastPick = obj;
      }
    } else {
      // 空白区域
      this.materialChange(this.lastPick, 'reset');
    }
  }

  darkenNonBloomed(obj) {
    // const type = obj.type;
    // if (!typeList.includes(type)) {
    //   typeList.push(type);
    // }

    if (
      highLightFilterList.includes(obj.type) &&
      bloomLayer.test(obj.layers) === false
    ) {
      // 隐藏不需要高亮的
      obj.visible = false;
      materials[obj.uuid] = obj.uuid;
    } else {
      // console.log(obj);
    }
  }

  restoreMaterial(obj) {
    if (materials[obj.uuid]) {
      // obj.material = materials[obj.uuid];
      obj.visible = true;
      delete materials[obj.uuid];
    }
  }

  // render
  render() {
    // render 方法
    // render scene with bloom
    this.currentScene.traverse(this.darkenNonBloomed.bind(this));
    this.bloomComposer.render();
    this.currentScene.traverse(this.restoreMaterial.bind(this));

    // render the entire scene, then render bloom scene on top
    this.finalComposer.render();

    // this.renderer.render(this.currentScene, this.camera);
    this.controls.update();
    TWEEN.update();
    requestAnimationFrame(this.render.bind(this));
  }

  // China Map JSON
  loadMapData() {
    // const loader = new THREE.FileLoader();

    // // 设置 output 格式
    // loader.setResponseType('json');

    // loader.load('static/china.json', (data) => {
    //   const jsondata = JSON.parse(JSON.stringify(data));
    //   this.generateGeometry(jsondata);

    //   this.animate();
    // });

    this.generateGeometry({
      jsondata: chinaJson,
      projectionParams: {
        center: [104.0, 37.5],
        scale: 100,
      },
      targetScene: this.currentScene,
    });
    const chinaOutlineMesh = chinaOutlineMeshRender();
    chinaOutlineMesh.layers.enable(BLOOM_SCENE);
    this.scene.add(chinaOutlineMesh);
  }

  generateGeometry({ jsondata, projectionParams, targetScene }) {
    const { scale, center } = projectionParams;
    // 初始化一个地图对象
    this.map = new THREE.Object3D();
    // 墨卡托投影转换
    const projection = d3
      .geoMercator()
      .center(center)
      .scale(scale)
      .translate([0, 0]);

    const textureLoader = new THREE.TextureLoader(); // 纹理加载器
    const texture = textureLoader.load(MapPng);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const genMaterials = (polygon) => {
      const shape = new THREE.Shape();
      // const shape1 = new THREE.Shape();
      // const shape1_c = new THREE.Path();
      const lineMaterial = new THREE.LineBasicMaterial({
        color: this.lineColor,
        linewidth: 2,
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
      // console.log('point', points);
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

      const extrudeSettings = {
        // depth: i % 2 === 0 ? 9 : 3,
        depth: 6,
        bevelEnabled: false,
      };
      // console.log('extrudeSettings', extrudeSettings, i);

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      // const geometry1 = new THREE.ExtrudeGeometry(shape1, extrudeSettings);
      // const lineExtrudeGeometry = new THREE.ExtrudeGeometry(
      //   lineGeometry,
      //   extrudeSettings,
      // );
      // 平面的 style
      const material = new THREE.MeshBasicMaterial({
        // color: this.surfaceColor,
        // transparent: false,
        // opacity: 0.9,
        map: texture,
      });
      // 3D 斜面的 style
      const material1 = new THREE.MeshBasicMaterial({
        color: this.bodyColor,
        transparent: true,
        opacity: 0.8,
      });

      // const outlineMaterial = new THREE.MeshBasicMaterial({
      //   color: this.bodyColor,
      // });

      const mesh = new THREE.Mesh(geometry, [material, material1]);

      const line = new THREE.Line(lineGeometry, lineMaterial);
      // line.layers.enable(BLOOM_SCENE);

      // const outlineShape = new THREE.Mesh(geometry1, outlineMaterial);
      // outlineShape.layers.enable(BLOOM_SCENE);

      // line.layers.set(1);
      // mesh.layers.set(1);
      return {
        mesh,
        line,
        // outlineShape
      };
    };

    jsondata.features.forEach((elem) => {
      // 定一个省份3D对象
      const province = new THREE.Object3D();
      province.userData.isProvince = true;
      // 每个的 坐标 数组
      const { coordinates, type } = elem.geometry;

      if (type === 'MultiPolygon') {
        // 多个，多边形
        coordinates.forEach((coordinate) => {
          // coordinate 多边形数据
          coordinate.forEach((polygon) => {
            const { mesh, line, outlineShape } = genMaterials(polygon);
            province.add(mesh);
            province.add(line);
            // province.add(outlineShape);
          });
        });
      }

      if (type === 'Polygon') {
        // 多边形
        coordinates.forEach((polygon) => {
          const { mesh, line, outlineShape } = genMaterials(polygon);
          province.add(mesh);
          province.add(line);
          // province.add(outlineShape);
        });
      }

      // 将 geojson 的 properties 放到模型中，后面会用到
      province.properties = elem.properties;
      if (elem.properties.centroid) {
        const [x, y] = projection(elem.properties.centroid);
        province.properties._centroid = [x, y];
      }
      this.map.add(province);
    });
    targetScene.add(this.map);
    // this.addHelper();
  }
}

export default MapRender;
