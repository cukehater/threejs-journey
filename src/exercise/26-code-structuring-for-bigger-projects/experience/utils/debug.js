/**
 * Debug (디버그 UI)
 * ----------------------------------------
 * URL에 #debug가 있으면 lil-gui 패널을 켭니다.
 * Fox 등에서 this.debug.ui.addFolder()로 컨트롤을 추가할 수 있습니다.
 */

import GUI from "lil-gui";

export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.ui = new GUI();
    }
  }
}
