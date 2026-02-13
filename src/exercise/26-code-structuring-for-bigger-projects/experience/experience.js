import * as THREE from "three";
import Sizes from "./utils/sizes";
import Time from "./utils/time";
import Camera from "./camera";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }

    instance = this;
    // Global access
    window.experience = this;
    this.canvas = canvas;
    this.sizes = new Sizes(600, 600);
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();

    // sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {}

  update() {}
}
