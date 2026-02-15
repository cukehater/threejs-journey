/**
 * Environment (환경)
 * ----------------------------------------
 * 조명(태양광)과 환경맵(반사/조명용 큐브텍스처)을 씬에 설정합니다.
 * scene.environment에 넣으면 MeshStandardMaterial이 자동으로 반사에 사용합니다.
 */

import * as THREE from "three";
import Experience from "../experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.setSunLight();
    this.setEnvironmentMap();
  }

  /** 방향광(태양) 추가 및 그림자 설정 */
  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);

    this.scene.add(this.sunLight);
  }

  /** 큐브맵을 씬 환경맵으로 지정 (반사/간접광용). updateMaterials는 나중에 씬에 추가되는 메쉬에도 envMap 적용 */
  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.texture = this.resources.items["environmentMapTexture"];
    this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material.isMeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.needsUpdate = true;
        }
      });
    };
  }
}
