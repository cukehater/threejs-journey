/**
 * Sizes (화면 크기)
 * ----------------------------------------
 * 창 크기·픽셀비를 저장하고, resize 시 "resize" 이벤트를 발생시킵니다.
 *
 * [OOP: 상속] extends EventEmitter = EventEmitter의 on/off/trigger를 그대로 사용.
 * super() = 부모(EventEmitter)의 constructor를 먼저 실행 (반드시 호출).
 */

import EventEmitter from "./event-emitter.js";

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.trigger("resize");
    });
  }
}
