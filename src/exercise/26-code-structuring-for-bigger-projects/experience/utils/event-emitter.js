/**
 * EventEmitter (이벤트 방출기)
 * ----------------------------------------
 * "이벤트 이름"으로 함수를 등록하고, 나중에 그 이름을 부르면 등록된 함수들이 실행됩니다.
 * 예: on("resize", fn) → trigger("resize") 시 fn() 실행.
 *
 * [OOP] 다른 클래스(Sizes, Time, Resources)가 이 클래스를 "상속(extends)"해서
 * .on(), .off(), .trigger() 메서드를 그대로 쓸 수 있게 합니다.
 */

export default class EventEmitter {
  constructor() {
    // 이벤트 이름별로 콜백 함수 배열을 저장 (예: { base: { resize: [fn1], tick: [fn2] } })
    this.callbacks = {};
    this.callbacks.base = {};
  }

  /** 이벤트 이름 _names에 callback 함수 등록 (구독). 체이닝을 위해 this 반환 */
  on(_names, callback) {
    // Errors
    if (typeof _names === "undefined" || _names === "") {
      console.warn("wrong names");
      return false;
    }

    if (typeof callback === "undefined") {
      console.warn("wrong callback");
      return false;
    }

    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name) => {
      // Resolve name
      const name = this.resolveName(_name);

      // Create namespace if not exist
      if (!(this.callbacks[name.namespace] instanceof Object))
        this.callbacks[name.namespace] = {};

      // Create callback if not exist
      if (!(this.callbacks[name.namespace][name.value] instanceof Array))
        this.callbacks[name.namespace][name.value] = [];

      // Add callback
      this.callbacks[name.namespace][name.value].push(callback);
    });

    return this;
  }

  /** 등록된 이벤트 리스너 제거 (구독 해제) */
  off(_names) {
    // Errors
    if (typeof _names === "undefined" || _names === "") {
      console.warn("wrong name");
      return false;
    }

    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name) => {
      // Resolve name
      const name = this.resolveName(_name);

      // Remove namespace
      if (name.namespace !== "base" && name.value === "") {
        delete this.callbacks[name.namespace];
      }

      // Remove specific callback in namespace
      else {
        // Default
        if (name.namespace === "base") {
          // Try to remove from each namespace
          for (const namespace in this.callbacks) {
            if (
              this.callbacks[namespace] instanceof Object &&
              this.callbacks[namespace][name.value] instanceof Array
            ) {
              delete this.callbacks[namespace][name.value];

              // Remove namespace if empty
              if (Object.keys(this.callbacks[namespace]).length === 0)
                delete this.callbacks[namespace];
            }
          }
        }

        // Specified namespace
        else if (
          this.callbacks[name.namespace] instanceof Object &&
          this.callbacks[name.namespace][name.value] instanceof Array
        ) {
          delete this.callbacks[name.namespace][name.value];

          // Remove namespace if empty
          if (Object.keys(this.callbacks[name.namespace]).length === 0)
            delete this.callbacks[name.namespace];
        }
      }
    });

    return this;
  }

  /** 이벤트 _name을 발생시켜 해당 이름으로 등록된 모든 콜백 실행. _args는 콜백에 전달할 인자 배열 */
  trigger(_name, _args) {
    // Errors
    if (typeof _name === "undefined" || _name === "") {
      console.warn("wrong name");
      return false;
    }

    let finalResult = null;
    let result = null;

    // Default args
    const args = !(_args instanceof Array) ? [] : _args;

    // Resolve names (should on have one event)
    let name = this.resolveNames(_name);

    // Resolve name
    name = this.resolveName(name[0]);

    // Default namespace
    if (name.namespace === "base") {
      // Try to find callback in each namespace
      for (const namespace in this.callbacks) {
        if (
          this.callbacks[namespace] instanceof Object &&
          this.callbacks[namespace][name.value] instanceof Array
        ) {
          this.callbacks[namespace][name.value].forEach(function (callback) {
            result = callback.apply(this, args);

            if (typeof finalResult === "undefined") {
              finalResult = result;
            }
          });
        }
      }
    }

    // Specified namespace
    else if (this.callbacks[name.namespace] instanceof Object) {
      if (name.value === "") {
        console.warn("wrong name");
        return this;
      }

      this.callbacks[name.namespace][name.value].forEach(function (callback) {
        result = callback.apply(this, args);

        if (typeof finalResult === "undefined") finalResult = result;
      });
    }

    return finalResult;
  }

  /** "name1, name2" 같은 문자열을 ["name1", "name2"] 배열로 변환 */
  resolveNames(_names) {
    let names = _names;
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, "");
    names = names.replace(/[,/]+/g, " ");
    names = names.split(" ");

    return names;
  }

  /** "eventName.namespace" 형태를 { value, namespace } 객체로 파싱 */
  resolveName(name) {
    const newName = {};
    const parts = name.split(".");

    newName.original = name;
    newName.value = parts[0];
    newName.namespace = "base"; // Base namespace

    // Specified namespace
    if (parts.length > 1 && parts[1] !== "") {
      newName.namespace = parts[1];
    }

    return newName;
  }
}
