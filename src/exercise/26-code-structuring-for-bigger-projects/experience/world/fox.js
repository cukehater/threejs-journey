/**
 * Fox (폭스 모델 + 애니메이션)
 * ----------------------------------------
 * GLTF 폭스 모델을 씬에 넣고, idle/walking/running 클립을 재생합니다.
 *
 * [OOP] this.resource = this.resources.items.foxModel 처럼
 * "다른 객체가 가진 데이터"를 참조해서 사용합니다 (의존성 주입과 비슷한 느낌).
 *
 * [애니메이션] AnimationMixer + clipAction으로 클립을 재생하고,
 * play(name)으로 전환 시 crossFadeFrom으로 부드럽게 넘깁니다.
 */

import * as THREE from "three";
import Experience from "../experience";

export default class Fox {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.foxModel;
    this.debug = this.experience.debug;

    this.setModel();
    this.setAnimation();

    if (this.debug.active) {
      const debugObject = {
        playIdle: () => {
          this.animation.play("idle");
        },
        playWalking: () => {
          this.animation.play("walking");
        },
        playRunning: () => {
          this.animation.play("running");
        },
      };

      this.debugFolder = this.debug.ui.addFolder("fox");
      this.debugFolder.add(debugObject, "playIdle");
      this.debugFolder.add(debugObject, "playWalking");
      this.debugFolder.add(debugObject, "playRunning");
    }
  }

  /** GLTF 씬을 스케일 조정 후 씬에 추가, 그림자 설정 */
  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);

    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  /** AnimationMixer와 clipAction으로 idle/walking/running 등록, 현재 재생 중인 액션 추적 및 play(name)으로 전환 */
  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.actions = {};

    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0],
    );
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1],
    );
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2],
    );

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;
    };
  }

  /** 매 프레임 애니메이션 mixer 업데이트 (delta는 밀리초이므로 0.001 곱해 초 단위로) */
  update() {
    this.animation.mixer.update(this.experience.time.delta * 0.001);
  }
}
