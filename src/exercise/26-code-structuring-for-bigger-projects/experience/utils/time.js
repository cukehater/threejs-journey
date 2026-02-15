/**
 * Time (시간/프레임 루프)
 * ----------------------------------------
 * requestAnimationFrame으로 매 프레임 "tick" 이벤트를 발생시킵니다.
 * elapsed = 시작 후 경과 시간, delta = 이전 프레임과의 시간 차 (애니메이션에 사용).
 *
 * [OOP] EventEmitter를 상속해 .on("tick", callback)으로 매 프레임 코드 실행.
 */

import EventEmitter from "./event-emitter.js";

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  /** 매 프레임 호출: tick 이벤트 발생 → 시간 값 갱신 → 다음 프레임 예약 */
  tick() {
    this.trigger("tick");

    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
