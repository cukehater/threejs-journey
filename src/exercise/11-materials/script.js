import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/Addons.js'

const gui = new GUI({
  width: 300,
  title: 'Marco Awesome Geometries',
  closeFolders: true,
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg',
)
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Object
 */
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color('red')
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.2
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial()

// MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial()

// MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// MeshToonMaterial
// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

// MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 1
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(1, 1)
// material.normalMapEnabled = true // 커스텀 속성 추가
// material.alphaMap = doorAlphaTexture
// material.transparent = true

// MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 0
material.roughness = 0
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(1, 1)
// material.normalMapEnabled = true // 커스텀 속성 추가
// material.alphaMap = doorAlphaTexture
// material.transparent = true
// Physical properties
// material.clearcoat = 1
// material.clearcoatRoughness = 0
// material.sheen = 1
// material.sheenRoughness = 0.25
// material.sheenColor = new THREE.Color(0x1188ff)
// material.iridescence = 1
// material.iridescenceIOR = 1.5
// material.iridescenceThicknessRange = [100, 200]
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

material.transmissionDepthWrite = true

gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)
// gui.add(material, 'aoMapIntensity').min(0).max(1).step(0.001)
// gui.add(material, 'displacementScale').min(0).max(1).step(0.001)
// // normalMap
// gui
//   .add(material, 'normalMapEnabled')
//   .name('Toggle Normal Map')
//   .onChange(() => {
//     material.normalMap = material.normalMapEnabled ? doorNormalTexture : null
//     material.needsUpdate = true
//   })
// gui.add(material, 'clearcoat').min(0).max(1).step(0.001)
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.001)

// gui.add(material, 'sheen').min(0).max(1).step(0.001)
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.001)
// gui.addColor(material, 'sheenColor').onChange(() => {
//   material.needsUpdate = true
// })

// gui.add(material, 'iridescence').min(0).max(1).step(0.001)
// gui.add(material, 'iridescenceIOR').min(0).max(1).step(0.001)
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1)

gui.add(material, 'transmission').min(0).max(1).step(0.001)
gui.add(material, 'ior').min(0).max(10).step(0.001)
gui.add(material, 'thickness').min(0).max(1).step(0.001)

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  material,
)

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  material,
)
const torusMesh = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material,
)

sphereMesh.position.x = -1.5
torusMesh.position.x = 1.5

scene.add(sphereMesh, planeMesh, torusMesh)

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

// const pointRight = new THREE.PointLight(0xffffff, 20)
// pointRight.position.set(2, 3, 4)
// scene.add(pointRight)

/**
 * Environment map
 */

const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/environmentMap/2k.hdr', environmentMap => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = environmentMap
  scene.environment = environmentMap
})

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  sphereMesh.rotation.y = 0.3 * elapsedTime
  planeMesh.rotation.y = 0.3 * elapsedTime
  torusMesh.rotation.y = 0.3 * elapsedTime

  sphereMesh.rotation.x = 0.3 * elapsedTime
  planeMesh.rotation.x = 0.3 * elapsedTime
  torusMesh.rotation.x = 0.3 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
