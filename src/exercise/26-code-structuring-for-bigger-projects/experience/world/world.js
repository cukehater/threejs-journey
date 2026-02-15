/**
 * World (월드 / 씬 내용물)
 * ----------------------------------------
 * 씬에 들어갈 오브젝트(바닥, 폭스, 환경광/환경맵)를 관리합니다.
 *
 * [비동기 순서] 리소스가 전부 로드된 뒤에만 Floor, Fox, Environment를 만듭니다.
 * resources.on("ready", ...) 때문에 텍스처·모델에 접근할 수 있을 때 초기화됩니다.
 *
 * [조합] World는 Floor, Fox, Environment 클래스를 "가지고 있는" 구조(composition).
 */

import * as THREE from "three";
import Experience from "../experience";
import Environment from "./environment";
import Floor from "./floor";
import Fox from "./fox";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
    });
  }

  /** 매 프레임 호출. 폭스 애니메이션 등 월드 내 갱신 로직 */
  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}
