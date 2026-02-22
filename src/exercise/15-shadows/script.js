import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
scene.add(ambientLight);

//? Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
// directionalLight.position.set(2, 2, -1);
// gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
// gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
// gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
// gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(64, 64);
// directionalLight.shadow.camera.near = 1;
// directionalLight.shadow.camera.far = 6;
// directionalLight.shadow.camera.top = 1;
// directionalLight.shadow.camera.right = 1;
// directionalLight.shadow.camera.bottom = -1;
// directionalLight.shadow.camera.left = -1;
// directionalLight.shadow.radius = 5;

// const directionalLightHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera,
// );
// scene.add(directionalLightHelper);

//? SpotLight
// const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
// spotLight.castShadow = true;
// spotLight.shadow.mapSize.set(64, 64);
// spotLight.position.set(0, 2, 2);
// scene.add(spotLight);

// const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(spotLightCameraHelper);

//? PointLight
// const pointLight = new THREE.PointLight(0xffffff, 2.7);
// pointLight.castShadow = true;
// pointLight.position.set(0, 1, 2);
// scene.add(pointLight);

// const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera, 0.2);
// scene.add(pointLightHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshBasicMaterial(),
);

const textureLoader = new THREE.TextureLoader();

//? Baked shadow
// const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
// bakedShadow.colorSpace = THREE.SRGBColorSpace;

// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 5),
//   new THREE.MeshBasicMaterial({
//     map: bakedShadow,
//   }),
// );

//? Dynamic fake shadow
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  }),
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphere, sphereShadow, plane);

plane.rotation.x = -Math.PI * 0.5;
// plane.position.y = -0.5;
// plane.receiveShadow = true;

// scene.add(sphere, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Shadows
// renderer.shadowMap.enabled = true;

// renderer.shadowMap.type = THREE.BasicShadowMap; // 성능 최고
renderer.shadowMap.type = THREE.PCFShadowMap; // 성능 중간
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 성능 중간
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 성능 낮음

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // 구체 이동
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  // 그림자 위치와 투명도 동기화
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
