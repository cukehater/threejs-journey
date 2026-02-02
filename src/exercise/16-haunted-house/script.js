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

//*================================================================== Textures
// Textures
const textureLoader = new THREE.TextureLoader();

const floorAlphaTexture = textureLoader.load("/textures/floor/alpha.webp");
const floorColorTexture = textureLoader.load("/textures/floor/diffuse.webp");
const floorNormalTexture = textureLoader.load("/textures/floor/normal.webp");
const floorARMTexture = textureLoader.load("/textures/floor/arm.webp");
const floorDisplacementTexture = textureLoader.load(
  "/textures/floor/displacement.webp"
);

floorAlphaTexture.repeat.set(8, 8);
floorAlphaTexture.wrapS = THREE.RepeatWrapping;
floorAlphaTexture.wrapT = THREE.RepeatWrapping;

floorColorTexture.repeat.set(8, 8);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.repeat.set(8, 8);
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorARMTexture.repeat.set(8, 8);
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.repeat.set(8, 8);
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

//!================================================================== Mesh Objects
// Floor
const floorMeasures = {
  width: 20,
  height: 20,
};
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(floorMeasures.width, floorMeasures.height),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    // alphaMap: floorAlphaTexture,
    // normalMap: floorNormalTexture,
    // transparent: true,
  })
);

floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// House Container
const house = new THREE.Group();
scene.add(house);

// Walls
const wallsMeasures = {
  width: 4,
  height: 2.5,
  depth: 4,
};
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(
    wallsMeasures.width,
    wallsMeasures.height,
    wallsMeasures.depth
  ),
  new THREE.MeshStandardMaterial()
);
walls.position.y = wallsMeasures.height * 0.5;
house.add(walls);

// Roofs
const roofsMeasures = {
  width: 3.5,
  height: 1.5,
  segments: 4,
};
const roofs = new THREE.Mesh(
  new THREE.ConeGeometry(
    roofsMeasures.width,
    roofsMeasures.height,
    roofsMeasures.segments
  ),
  new THREE.MeshStandardMaterial()
);
roofs.position.y = wallsMeasures.height + roofsMeasures.height * 0.5;
roofs.rotation.y = Math.PI * 0.25;
house.add(roofs);

// Door
const doorMeasures = {
  width: 1.5,
  height: 2,
};

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorMeasures.width, doorMeasures.height),
  new THREE.MeshStandardMaterial()
);
door.position.y = doorMeasures.height * 0.5;
door.position.z = wallsMeasures.depth * 0.5 + 0.001;
house.add(door);

// Bushes
const bushes = [
  {
    position: {
      x: 0.8,
      y: 0.2,
      z: 2.2,
    },
    scale: {
      x: 0.5,
      y: 0.5,
      z: 0.5,
    },
  },
  {
    position: {
      x: 1.4,
      y: 0.1,
      z: 2.1,
    },
    scale: {
      x: 0.25,
      y: 0.25,
      z: 0.25,
    },
  },
  {
    position: {
      x: -0.8,
      y: 0.1,
      z: 2.2,
    },
    scale: {
      x: 0.4,
      y: 0.4,
      z: 0.4,
    },
  },
  {
    position: {
      x: -1,
      y: 0.05,
      z: 2.6,
    },
    scale: {
      x: 0.15,
      y: 0.15,
      z: 0.15,
    },
  },
];
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial();

for (const { position, scale } of bushes) {
  const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);
  bushMesh.position.set(position.x, position.y, position.z);
  bushMesh.scale.set(scale.x, scale.y, scale.z);
  house.add(bushMesh);
}

// Graves
const gravesMeasures = {
  width: 0.6,
  height: 0.8,
  depth: 0.2,
};
const gravesGeometry = new THREE.BoxGeometry(
  gravesMeasures.width,
  gravesMeasures.height,
  gravesMeasures.depth
);
const gravesMaterial = new THREE.MeshStandardMaterial();

const graves = new THREE.Group();

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const graveMesh = new THREE.Mesh(gravesGeometry, gravesMaterial);
  graveMesh.position.set(x, gravesMeasures.height * 0.5, z);
  graveMesh.rotation.x = Math.random() - 0.5 * 0.4;
  graveMesh.rotation.y = Math.random() - 0.5 * 0.4;
  graveMesh.rotation.z = Math.random() - 0.5 * 0.4;
  graves.add(graveMesh);
}

scene.add(graves);

//?================================================================== Lights
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

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
  0.01,
  100
);
camera.position.x = 4;
camera.position.y = 4;
camera.position.z = 10;
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

/**
 * Animate
 */
const timer = new THREE.Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
