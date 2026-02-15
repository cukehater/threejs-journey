/**
 * Experience (경험/앱 진입점)
 * ----------------------------------------
 * 이 클래스는 Three.js 앱의 "중앙 허브"입니다.
 * 모든 모듈(카메라, 렌더러, 월드 등)을 만들고, 이벤트로 연결합니다.
 *
 * [OOP 개념] class = 비슷한 역할을 하는 데이터+함수를 묶은 설계도.
 * constructor = 클래스를 new Experience()로 만들 때 한 번 실행되는 함수.
 */

import * as THREE from "three";
import Sizes from "./utils/sizes.js";
import Time from "./utils/time.js";
import Camera from "./camera.js";
import Renderer from "./renderer.js";
import World from "./world/world.js";
import Resources from "./utils/resources.js";
import sources from "./world/sources.js";
import Debug from "./utils/debug.js";

/** [싱글톤] 앱 전체에서 Experience 인스턴스가 하나만 있도록 저장 */
let instance = null;

export default class Experience {
  constructor(canvas) {
    // [싱글톤 패턴] 이미 만들어진 인스턴스가 있으면 새로 만들지 않고 그걸 반환.
    // Camera, Renderer 등 다른 클래스에서 new Experience()를 호출해도 같은 객체를 받게 됨.
    if (instance) {
      return instance;
    }

    instance = this;

    // 디버깅 시 window.experience로 콘솔에서 접근 가능
    window.experience = this;
    this.canvas = canvas;

    // 유틸: 화면 크기, 시간(프레임), 리소스 로딩, 디버그 UI
    this.sizes = new Sizes(600, 600);
    this.time = new Time();
    this.resources = new Resources(sources);
    this.debug = new Debug();

    // Three.js 핵심: 씬, 카메라, 렌더러, 월드(바닥/폭스/환경 등)
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // [이벤트 구독] 창 크기가 바뀌면 resize() 실행
    this.sizes.on("resize", () => {
      this.resize();
    });

    // [이벤트 구독] 매 프레임마다 update() 실행 (애니메이션 루프)
    this.time.on("tick", () => {
      this.update();
    });
  }

  /** 창 크기 변경 시 카메라·렌더러 크기 맞춤 */
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  /** 매 프레임 호출: 카메라(컨트롤), 월드(폭스 애니메이션 등), 렌더링 */
  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  /** 앱 종료 시 리스너 해제, geometry/material 등 메모리 해제 */
  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        for (const key in child.material) {
          if (
            child.material[key] &&
            typeof child.material[key].dispose === "function"
          ) {
            child.material[key].dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
