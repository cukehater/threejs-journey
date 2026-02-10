import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";

/**
 * Loader
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();

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
 * Environment map
 */
scene.environmentIntensity = 1;
gui.add(scene, "environmentIntensity").min(0).max(10).step(0.001);
scene.backgroundBlurriness = 0;
gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
scene.backgroundIntensity = 1;
gui.add(scene, "backgroundIntensity").min(0.1).max(10).step(0.001);
scene.backgroundRotation.y = Math.PI * 0.25;
gui
  .add(scene.backgroundRotation, "y")
  .min(0)
  .max(Math.PI * 2)
  .step(0.001)
  .name("Background Rotation Y");

// LDR cube texture
/* const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/1/px.png",
  "/textures/environmentMaps/1/nx.png",
  "/textures/environmentMaps/1/py.png",
  "/textures/environmentMaps/1/ny.png",
  "/textures/environmentMaps/1/pz.png",
  "/textures/environmentMaps/1/nz.png",
]); */

// HDR cube texture
const environmentMapTexture = rgbeLoader.load(
  "/textures/environmentMaps/0/2k.hdr",
  (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
  },
);
// scene.background = environmentMapTexture;
// scene.environment = environmentMapTexture;

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    roughness: 0.3,
    metalness: 1,
    envMap: environmentMapTexture,
  }),
);
torusKnot.position.x = -4;
torusKnot.position.y = 4;
scene.add(torusKnot);

/**
 * models
 */
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  scene.add(gltf.scene);
});

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
camera.position.set(4, 5, 8);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
