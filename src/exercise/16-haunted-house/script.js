import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { Sky } from "three/examples/jsm/Addons.js";

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

floorColorTexture.repeat.set(4, 4);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorNormalTexture.repeat.set(4, 4);
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorARMTexture.repeat.set(4, 4);
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.repeat.set(4, 4);
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

const wallColorTexture = textureLoader.load("/textures/wall/diffuse.webp");
const wallNormalTexture = textureLoader.load("/textures/wall/normal.webp");
const wallARMTexture = textureLoader.load("/textures/wall/arm.webp");

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

const roofColorTexture = textureLoader.load("/textures/roof/diffuse.webp");
const roofNormalTexture = textureLoader.load("/textures/roof/normal.webp");
const roofARMTexture = textureLoader.load("/textures/roof/arm.webp");

roofColorTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

const bushColorTexture = textureLoader.load("/textures/bush/diffuse.webp");
const bushNormalTexture = textureLoader.load("/textures/bush/normal.webp");
const bushARMTexture = textureLoader.load("/textures/bush/arm.webp");

bushColorTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

const graveColorTexture = textureLoader.load("/textures/grave/diffuse.webp");
const graveNormalTexture = textureLoader.load("/textures/grave/normal.webp");
const graveARMTexture = textureLoader.load("/textures/grave/arm.webp");

graveColorTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

const doorColorTexture = textureLoader.load("/textures/door/color.webp");
const doorNormalTexture = textureLoader.load("/textures/door/normal.webp");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.webp"
);
const doorMetalnessTexture = textureLoader.load(
  "/textures/door/metalness.webp"
);
const doorRoughnessTexture = textureLoader.load(
  "/textures/door/roughness.webp"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.webp");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.webp");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

//!================================================================== Mesh Objects
// Floor
const floorMeasures = {
  width: 20,
  height: 20,
  widthSegments: 100,
  heightSegments: 100,
};
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(
    floorMeasures.width,
    floorMeasures.height,
    floorMeasures.widthSegments,
    floorMeasures.heightSegments
  ),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
    // wireframe: true,
  })
);

floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");

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
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
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
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roofs.position.y = wallsMeasures.height + roofsMeasures.height * 0.5;
roofs.rotation.y = Math.PI * 0.25;
house.add(roofs);

// Door
const doorMeasures = {
  width: 2,
  height: 2,
  widthSegments: 100,
  heightSegments: 100,
};

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(
    doorMeasures.width,
    doorMeasures.height,
    doorMeasures.widthSegments,
    doorMeasures.heightSegments
  ),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    alphaMap: doorAlphaTexture,
    displacementMap: doorHeightTexture,
    transparent: true,
    displacementScale: 0.2,
    displacementBias: -0.1,
  })
);
door.position.y = doorMeasures.height * 0.5;
door.position.z = wallsMeasures.depth * 0.5 + 0.01;
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
const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0xccffcc,
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

for (const { position, scale } of bushes) {
  const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);
  bushMesh.position.set(position.x, position.y, position.z);
  bushMesh.scale.set(scale.x, scale.y, scale.z);
  bushMesh.rotation.x = -0.75;
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
const gravesMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

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
  // graveMesh.rotation.z = Math.random() - 0.5 * 0.1
  graves.add(graveMesh);
}

scene.add(graves);

//?================================================================== Lights
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door Light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.2);
scene.add(doorLight);

const doorLightBaseIntensity = 5;
const doorLightMinFactor = 0.15; // 최소 15% 밝기
const doorLightMaxFactor = 1.2; // 최대 120% 밝기

// Ghost Light
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);

scene.add(ghost1, ghost2, ghost3);

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
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roofs.castShadow = true;
floor.receiveShadow = true;

for (const grave of graves.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

/**
 * Sky
 */
const sky = new Sky();
sky.scale.setScalar(100);
scene.add(sky);

sky.material.uniforms.turbidity.value = 10;
sky.material.uniforms.rayleigh.value = 3;
sky.material.uniforms.mieCoefficient.value = 0.01;
sky.material.uniforms.mieDirectionalG.value = 0.95;
sky.material.uniforms.sunPosition.value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
scene.fog = new THREE.FogExp2(0x02343f, 0.1);
/**
 * Animate
 */
const timer = new THREE.Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Door light flicker: 여러 주기의 sin 곱으로 불규칙한 곡선
  const f1 = Math.sin(elapsedTime * 12.7);
  const f2 = Math.sin(elapsedTime * 31.1);
  const f3 = Math.sin(elapsedTime * 7.3);
  const flicker = f1 * f2 * f3;
  // flicker ∈ [-1, 1] → [0, 1]로 매핑 후 min~max 비율 적용
  const t = flicker * 0.5 + 0.5;
  const factor =
    doorLightMinFactor + (doorLightMaxFactor - doorLightMinFactor) * t;
  doorLight.intensity = Math.max(0.01, doorLightBaseIntensity * factor);

  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);

  const ghost2Angle = elapsedTime * 0.38;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);

  const ghost3Angle = elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
