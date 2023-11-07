import { PlaneGeometry, MeshToonMaterial, MeshLambertMaterial, MeshBasicMaterial, BoxGeometry, Mesh, SphereGeometry, TextureLoader, ShaderMaterial, DoubleSide, WebGLCubeRenderTarget, RGBAFormat, LinearMipMapLinearFilter, sRGBEncoding, CubeCamera } from "three";
import vertexShader from "../shader/vertex.glsl?raw";
import fragmentShader from "../shader/fragment.glsl?raw";

import vertexShader1 from "../shader/vertex1.glsl?raw";
import fragmentShader1 from "../shader/fragment1.glsl?raw";
import * as THREE from "three";

import { gsap, Power4 } from "gsap";

export default class Model {
  constructor(stage) {
    this.stage = stage;
    this.geometry;
    this.material;
    this.mesh;

    this.savePattern01 = [];
    this.savePattern02 = [];
    this.savePattern03 = [];

    this.group = [];
    this.OBJ = new THREE.Group();

    this.loader = new TextureLoader();

    this.speed = 0.001;

    this.size = 0.15;
  }

  _init() {
    this._objects();
  }

  createLens(index) {
    this.geometry = new SphereGeometry(this.size, 32, 32);
    this.material = new MeshToonMaterial({ color: 0xcccccc });
    const mesh = new Mesh(this.geometry, this.material);
    mesh.position.set(Math.random() * 2 - 1, Math.random() * 2 - 1, 0);
    return mesh;
  }

  _objects() {
    const length = 30;

    for (let i = 0; i < length; i++) {
      let mesh = this.createLens(i);
      this.group.push(mesh);
      this.OBJ.add(mesh);
    }
    this.stage.scene.add(this.OBJ);

    /*-------------------------
    * オブジェクト毎に位置を決定
    ----------------------------*/
    this.group.forEach((obj, index) => {
      obj.direction = {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 2 - 1,
      };

      obj.radius = Math.sqrt(this.size) / 2;
    });
  }

  checkCollision(obj1, obj2) {
    const distance = obj1.position.distanceTo(obj2.position);
    const thresholdDistance = obj1.radius + obj2.radius;
    return distance < thresholdDistance;
  }

  onUpdata() {
    for (let i = 0; i < this.group.length; i++) {
      for (let j = i + 1; j < this.group.length; j++) {
        const obj1 = this.group[i];
        const obj2 = this.group[j];

        if (this.checkCollision(obj1, obj2)) {
          const speedChange = 0.04;

          obj1.direction.x += speedChange;
          obj1.direction.y += speedChange;

          obj2.direction.x -= speedChange;
          obj2.direction.y -= speedChange;
        }
      }
    }

    this.group.forEach((obj, index) => {
      //X方向
      if (obj.position.x >= 2 || obj.position.x <= -2) {
        obj.direction.x = Math.random() * 2 - 1;
        if (obj.position.x >= 2) {
          obj.direction.x = Math.abs(obj.direction.x) * -1;
        } else if (obj.position.x <= -2) {
          obj.direction.x = Math.abs(obj.direction.x);
        }
      }

      //Y方向
      if (obj.position.y >= 1 || obj.position.y <= -1) {
        obj.direction.y = Math.random() * 2 - 1;
        if (obj.position.y >= 1) {
          obj.direction.y = Math.abs(obj.direction.y) * -1;
        } else if (obj.position.y <= -1) {
          obj.direction.y = Math.abs(obj.direction.y);
        }
      }

      //Z方向
      // if (obj.position.z >= 1 || obj.position.z <= -1) {
      //   obj.direction.z = Math.random() * 2 - 1;
      //   if (obj.position.z >= 1) {
      //     obj.direction.z = Math.abs(obj.direction.z) * -1;
      //   } else if (obj.position.z <= -1) {
      //     obj.direction.z = Math.abs(obj.direction.z);
      //   }
      // }

      obj.position.x += this.speed * obj.direction.x;
      obj.position.y += this.speed * obj.direction.y;
      // obj.position.z += this.speed * obj.direction.z;
    });
  }

  animation() {}
}
