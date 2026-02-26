/**
 * 20 - Physics (cannon-es)
 * Three.js 씬에 cannon-es 물리 엔진을 연동하여 구/박스가 중력으로 떨어지고
 * 바닥과 충돌하는 시뮬레이션을 구현합니다.
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import * as CANNON from "cannon-es";

/**
 * Debug - 디버그 UI (lil-gui)
 * 화면에서 구/박스를 랜덤 위치에 생성하는 버튼을 제공합니다.
 */
const gui = new GUI();
const debugObject = {};

// 랜덤 반지름(0~0.5), 랜덤 x/z 위치에 y=3 높이에서 구 생성
debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: Math.random() - 0.5 * 3,
    y: 3,
    z: Math.random() - 0.5 * 3,
  });
};

gui.add(debugObject, "createSphere");

// 랜덤 크기의 박스를 랜덤 위치에 생성
debugObject.createBox = () => {
  createBox(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5, {
    x: Math.random() - 0.5 * 3,
    y: 3,
    z: Math.random() - 0.5 * 3,
  });
};
gui.add(debugObject, "createBox");

/**
 * Base - 씬 기본 요소
 */
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

/**
 * Sounds - 충돌 시 효과음
 * cannon-es body의 "collide" 이벤트에서 충돌 속도에 따라 볼륨을 조절해 재생합니다.
 */
const hitSound = new Audio("/sounds/hit.mp3");
const playSound = (event) => {
  // 접촉면 법선 방향의 충돌 속도 (강한 충돌일수록 값이 큼)
  const impact = event.contact.getImpactVelocityAlongNormal();

  if (impact > 1.5) {
    hitSound.volume = impact / 10;
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

/**
 * Textures - 환경 맵 (반사/메탈 느낌용)
 * 6면 큐브맵으로 주변 환경을 반사해 메쉬에 적용합니다.
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics - cannon-es 물리 월드 설정
 */
// 물리 월드 생성
const world = new CANNON.World();
world.allowSleep = true; // 움직임이 거의 없으면 body를 슬립시켜 성능 절약
world.broadphase = new CANNON.SAPBroadphase(world); // 충돌 감지 알고리즘 (Sweep and Prune)
world.gravity.set(0, -9.82, 0); // 중력 (실제 지구 중력에 가깝게)

// 물리 재질: 충돌 시 마찰/반발 계수는 ContactMaterial에서 정의
const defaultMaterial = new CANNON.Material("default");

// 두 재질이 접촉할 때의 마찰(friction), 반발계수(restitution) 설정
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.6,
  },
);

world.addContactMaterial(defaultContactMaterial);

// 바닥 물리 body: 무한 평면, mass=0 이므로 고정(움직이지 않음)
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape,
  material: defaultMaterial,
});

// Cannon.js Plane은 기본이 Y축 위를 향함. Three.js 바닥과 맞추려면 X축 기준 -90도 회전
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);

world.addBody(floorBody);

/**
 * Floor - 시각용 바닥 메쉬
 * 물리 바닥(floorBody)과 별도로, 화면에 보이는 Plane 메쉬입니다.
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  }),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5; // 바닥이 위를 보도록
scene.add(floor);

/**
 * Lights - 조명
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes - 뷰포트 크기 및 리사이즈 처리
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera - 원근 카메라 + OrbitControls
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(-3, 3, 3);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer - WebGL 렌더러 및 그림자 설정
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils - 물리 객체 생성 유틸
 * Three.js 메쉬와 cannon-es Body를 쌍으로 만들어, 매 프레임에서 body 위치/회전을 메쉬에 동기화합니다.
 */
const objectsToUpdate = [];

// 구: 지오메트리/재질은 재사용 (인스턴스마다 scale로 크기 조절)
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

/**
 * 구체 생성: 시각 메쉬 + 물리 Sphere body를 만들고 objectsToUpdate에 등록
 * @param {number} radius - 구 반지름
 * @param {Object} position - { x, y, z } 초기 위치
 */
const createSphere = (radius, position) => {
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // 물리 구체 (반지름 0.5 고정; 메쉬는 scale로 크기 조절)
  const shape = new CANNON.Sphere(0.5);
  const body = new CANNON.Body({
    mass: 1,
    position,
    shape,
    material: defaultContactMaterial,
  });
  body.addEventListener("collide", playSound);
  world.addBody(body);

  objectsToUpdate.push({
    mesh,
    body,
  });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });

// 박스: 지오메트리/재질 재사용
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

/**
 * 박스 생성: 시각 메쉬 + 물리 Box body
 * @param {number} x - 너비
 * @param {number} y - 높이
 * @param {number} z - 깊이
 * @param {Object} position - { x, y, z } 초기 위치
 */
const createBox = (x, y, z, position) => {
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(x, y, z);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon Box는 "반 extent" 사용 (절반 크기)
  const shape = new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, z / 2));
  const body = new CANNON.Body({
    mass: 1,
    position,
    shape,
    material: defaultContactMaterial,
  });
  body.addEventListener("collide", playSound);
  world.addBody(body);

  objectsToUpdate.push({
    mesh,
    body,
  });
};

createBox(1, 1, 1, { x: 2, y: 2, z: 2 });

/**
 * Animate - 루프
 * 매 프레임: deltaTime으로 물리 스텝 → body 위치/회전을 메쉬에 복사 → 렌더
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const currentTime = clock.getElapsedTime();
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  // 고정 타임스텝 1/60, 최대 3 서브스텝으로 물리 시뮬레이션 진행
  world.step(1 / 60, deltaTime, 3);

  // 물리 body의 position, quaternion을 Three.js 메쉬에 동기화
  for (const obj of objectsToUpdate) {
    obj.mesh.position.copy(obj.body.position);
    obj.mesh.quaternion.copy(obj.body.quaternion);
  }

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
