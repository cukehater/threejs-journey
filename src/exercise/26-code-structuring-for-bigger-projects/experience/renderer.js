/**
 * Renderer (렌더러)
 * ----------------------------------------
 * WebGLRenderer를 만들고, 매 프레임 씬을 카메라 시점으로 그립니다.
 * Experience 싱글톤에서 canvas, sizes를 가져와 사용합니다.
 */

import * as THREE from "three";
import Experience from "./experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;

    this.setInstance();
  }

  /** WebGL 렌더러 생성 및 톤매핑·그림자·크기 설정 */
  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /** 창 크기/픽셀비 변경 시 렌더러 크기 갱신 */
  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /** 매 프레임: 씬을 카메라로 렌더링 */
  update() {
    this.instance.render(
      this.experience.scene,
      this.experience.camera.instance,
    );
  }
}
