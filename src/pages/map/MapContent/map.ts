// @ts-nocheck

import * as d3 from 'd3';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import chinaJson from '@/static/china.json';

class MapRender {
  container = document.getElementById('container');

  constructor(props) {
    console.log('MapRender');
  }

  init() {
    // 第一步新建一个场景
    this.scene = new THREE.Scene();
    THREE.Cache.enabled = true;

    this.setCamera();
    this.setRenderer();
    // this.setController();
    this.setRaycaster();
    this.loadMapData();
  }

  // 搜索高亮地区
  showRegion(provinceName) {
    try {
      if (this.obj3d !== null) {
        for (let typeElement of this.lastSearch) {
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
      for (let typeElement of provinceName) {
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
      50,
      this.container.offsetWidth / this.container.offsetHeight,
      0.1,
      1000,
    );
    this.camera.position.set(-25, -100, 120);
    this.camera.lookAt(0, 0, 0);
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
    //这里其实就是canvas 画布  renderer.domElement
    this.container.appendChild(this.renderer.domElement);

    // document.body.appendChild(this.renderer.domElement);
  }

  // render 方法
  render() {
    this.renderer.render(this.scene, this.camera);
  }

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
    };
    window.addEventListener('mousemove', onMouseMove, false);
  }
  setLight() {
    this.ambientLight = new THREE.AmbientLight('#ff0000');
    this.scene.add(this.ambientLight);
  }
  setController() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
  }

  // 动画
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    // 通过摄像机和鼠标位置更新射线
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 算出射线与当前场景相交的对象有那些
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true,
    );

    // 恢复上一次清空的
    if (this.lastPick) {
      this.lastPick.object.material[0].color.set('#3D479C');
      this.lastPick.object.material[1].color.set('#fff');
      // this.lastPick.object.translateOnAxis(new THREE.Vector3(0, 1, 0), -2);
      // if (!!this.lastPick.object.userData.transY) {
      // this.lastPick.object.translateOnAxis(new THREE.Vector3(0, 1, 0), -2);
      //   this.lastPick.object.userData.transY = false;
      // }
    }
    this.lastPick = null;
    this.lastPick = intersects.find(
      (item) => item.object.material && item.object.material.length === 2,
    );
    // console.log(intersects)
    // this.scene.children[0].forEach((ele) => {
    //     if (ele.properties.name === this.inputVal) {
    //         this.scene.children[0].object.material[0].color.set('#2EA6B4')
    //         this.scene.children[0].object.material[1].color.set('#2EA6B4')
    //     }
    // })

    if (this.lastPick) {
      console.log(' this.lastPick.object.material', this.lastPick.object);
      if (!this.lastPick.object.userData.transY) {
        this.lastPick.object.translateOnAxis(new THREE.Vector3(0, 1, 0), 2);
        this.lastPick.object.userData.transY = true;
      }

      this.lastPick.object.material[0].color.set('#2EA6B4');
      this.lastPick.object.material[1].color.set('#2EA6B4');

      // 显示 label
      const properties = this.lastPick.object.parent.properties;
      this.labelDom.textContent = properties.name;
      this.labelDom.style.visibility = 'visible';
    } else {
      this.labelDom.style.visibility = 'hidden';
    }
    // this.controls.update();
    this.render();
  }

  // 添加辅助系统
  addHelper() {
    const helper = new THREE.CameraHelper(this.camera);
    this.scene.add(helper);
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

    this.generateGeometry(chinaJson);

    this.animate();
  }

  generateGeometry(jsondata) {
    // 初始化一个地图对象
    this.map = new THREE.Object3D();
    // 墨卡托投影转换
    const projection = d3
      .geoMercator()
      .center([104.0, 37.5])
      .scale(100)
      .translate([0, 0]);
    jsondata.features.forEach((elem) => {
      // 定一个省份3D对象
      const province = new THREE.Object3D();
      // 每个的 坐标 数组
      const coordinates = elem.geometry.coordinates;
      // 循环坐标数组
      coordinates.forEach((multiPolygon, i) => {
        multiPolygon.forEach((polygon) => {
          const shape = new THREE.Shape();
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 'red',
            linewidth: 2,
          });
          const points = [];
          for (let i = 0; i < polygon.length; i++) {
            let [x, y] = projection(polygon[i]);
            points.push(new THREE.Vector3(x, -y, 6));
            if (i === 0) {
              shape.moveTo(x, -y);
            }
            shape.lineTo(x, -y);
          }
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

          const extrudeSettings = {
            // depth: i % 2 === 0 ? 9 : 3,
            depth: 6,
            bevelEnabled: false,
          };
          // console.log('extrudeSettings', extrudeSettings, i);

          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          // 平面的 style
          const material = new THREE.MeshBasicMaterial({
            color: 'blue',
            transparent: true,
            opacity: 0.9,
          });
          // 3D 斜面的 style
          const material1 = new THREE.MeshBasicMaterial({
            color: '#fff',
            transparent: true,
            opacity: 0.8,
          });
          const mesh = new THREE.Mesh(geometry, [material, material1]);
          const line = new THREE.Line(lineGeometry, lineMaterial);

          province.add(mesh);
          province.add(line);
        });
      });
      // 将 geojson 的 properties 放到模型中，后面会用到
      province.properties = elem.properties;
      if (elem.properties.centroid) {
        const [x, y] = projection(elem.properties.centroid);
        province.properties._centroid = [x, y];
      }
      this.map.add(province);
    });
    this.scene.add(this.map);
    this.addHelper();
  }
}

export default MapRender;
