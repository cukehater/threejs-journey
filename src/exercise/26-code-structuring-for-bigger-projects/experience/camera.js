/**
 * Camera (카메라)
 * ----------------------------------------
 * PerspectiveCamera와 OrbitControls를 설정합니다.
 *
 * [OOP + 싱글톤] new Experience()를 호출해도 Experience가 하나뿐이므로
 * 항상 같은 experience를 참조하고, sizes/scene/canvas를 거기서 가져옵니다.
 *
 * [설정 분리] setInstance(), setOrbitControls()처럼 초기화를 메서드로 나누면
 * 생성자가 짧아지고, 나중에 기능을 추가하기 쉽습니다.
 */

import * as THREE from "three";
import Experience from "./experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.setInstance();
    this.setOrbitControls();
  }

  /** Three.js 원근 카메라 생성 후 씬에 추가 */
  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100,
    );
    this.instance.position.set(6, 4, 8);

    this.scene.add(this.instance);
  }

  /** 마우스로 카메라를 돌리기 위한 OrbitControls 연결 */
  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  /** 창 크기 변경 시 비율(aspect) 반영 */
  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  /** 매 프레임 컨트롤 상태 반영 (damping 등) */
  update() {
    this.controls.update();
  }
}
