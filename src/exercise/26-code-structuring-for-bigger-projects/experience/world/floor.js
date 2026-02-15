/**
 * Floor (바닥)
 * ----------------------------------------
 * 원형 바닥 메쉬를 만들고 씬에 추가합니다.
 * 리소스는 Resources가 이미 로드한 items에서 가져옵니다.
 *
 * [설정 분리] setGeometry → setTextures → setMaterial → setMesh 순서로
 * 초기화를 나누어 읽기와 수정이 쉬운 구조로 만듭니다.
 */

import * as THREE from "three";
import Experience from "../experience";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  /** 원형 지오메트리 생성 (반지름 5, 세그먼트 64) */
  setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64);
  }

  /** 로드된 텍스처 참조 및 repeat/wrap 설정 */
  setTextures() {
    this.textures = {};

    this.textures.color = this.resources.items.grassColorTexture;
    this.textures.color.colorSpace = THREE.SRGBColorSpace;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.resources.items.grassNormalTexture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }

  /** 지오메트리 + 텍스처를 사용하는 머티리얼 생성 */
  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    });
  }

  /** 메쉬 생성 후 회전·그림자 설정하고 씬에 추가 */
  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}
