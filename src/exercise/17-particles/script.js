import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

console.time("render");
/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/1.png");

/**
 * Particles
 */
// const particlesGeometry = new THREE.SphereGeometry(1, 16, 16);
// const particlesMaterial = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true,
// });
// const particles = new THREE.Points(particlesGeometry, particlesMaterial);

const particlesGeometry = new THREE.BufferGeometry();

const count = 3000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  const i3 = i * 3;

  positions[i3 + 0] = (Math.random() - 0.5) * 10;
  positions[i3 + 1] = (Math.random() - 0.5) * 10;
  positions[i3 + 2] = (Math.random() - 0.5) * 10;

  colors[i3 + 0] = Math.random();
  colors[i3 + 1] = Math.random();
  colors[i3 + 2] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3),
);

particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  sizeAttenuation: true, // 거리에 따라 파티클 크기가 작아지는 원근 효과
  alphaMap: particleTexture, // 알파 맵으로 투명도 제어
  transparent: true, // 투명도 활성화
  depthWrite: false, // 깊이 쓰기 비활성화
  blending: THREE.AdditiveBlending, // 투명도 효과 추가
  vertexColors: true, // 파티클 색상을 버퍼 데이터에 따라 결정
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);

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
camera.position.z = 3;
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
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // particles.rotation.y = elapsedTime * 0.2;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // x 좌표를 오프셋으로 활용해 파도 위상을 다르게 설정
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x,
    );
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
console.timeEnd("render");
