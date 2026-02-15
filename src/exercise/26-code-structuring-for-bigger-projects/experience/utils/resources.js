/**
 * Resources (리소스 로더)
 * ----------------------------------------
 * 텍스처, 큐브맵, GLTF 모델 등을 비동기로 로드하고, 전부 로드되면 "ready" 이벤트 발생.
 * 로드된 에셋은 this.items[이름] 형태로 접근 (예: items.foxModel).
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import EventEmitter from "./event-emitter.js";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();
    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  /** 텍스처/큐브맵/GLTF용 로더 인스턴스 생성 */
  setLoaders() {
    this.loaders = {};
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.loaders.gltfLoader = new GLTFLoader();
  }

  /** sources 배열을 돌며 타입에 맞는 로더로 로드 시작 */
  startLoading() {
    for (const source of this.sources) {
      const onLoad = (file) => this.sourceLoaded(source, file);
      const onError = (err) => {
        console.error(
          `[Resources] Failed to load: ${source.name}`,
          source.path,
          err,
        );
        this.trigger("error", { source, error: err });
      };

      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, onLoad, undefined, onError);
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(
          source.path,
          onLoad,
          undefined,
          onError,
        );
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(
          source.path,
          onLoad,
          undefined,
          onError,
        );
      }
    }
  }

  /** 개별 리소스 로드 완료 시 호출. 전부 로드되면 "ready" 이벤트 발생 */
  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
