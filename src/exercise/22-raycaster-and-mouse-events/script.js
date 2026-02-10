import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js'
import gsap from 'gsap'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * GLTFLoader
 */
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
let duckModel = null
gltfLoader.load('/models/Duck/glTF-Binary/Duck.glb', gltf => {
  duckModel = gltf.scene
  duckModel.position.y = -1.2
  scene.add(duckModel)
})

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
)
object1.position.x = -2

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
)

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/**
 * Mouse
 */
let currentIntersect = null
const mouse = new THREE.Vector2(-2, -2)

window.addEventListener('mousemove', event => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1

  mouse.set(mouse.x, mouse.y)
})

window.addEventListener('click', () => {
  if (!currentIntersect) return
})

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.1)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

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
camera.position.z = 3
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

  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
  object2.position.y = Math.sin(elapsedTime) * 1.5
  object3.position.y = Math.sin(elapsedTime * 1.5) * 1.5

  const rayOrigin = new THREE.Vector3(-3, 0, 0)
  const rayDirection = new THREE.Vector3(1, 0, 0)
  rayDirection.normalize()

  raycaster.set(rayOrigin, rayDirection)
  raycaster.setFromCamera(mouse, camera)

  if (duckModel) {
    const duckIntersect = raycaster.intersectObject(duckModel)

    if (duckIntersect.length) {
      currentIntersect = duckIntersect[0]

      if (!currentIntersect) return

      gsap.to(duckModel.scale, {
        duration: 2,
        x: 1.2,
        y: 1.2,
        z: 1.2,
        ease: 'elastic.out(1, 0.3)',
      })
    } else {
      currentIntersect = null
      gsap.to(duckModel.scale, {
        duration: 2,
        x: 1,
        y: 1,
        z: 1,
        ease: 'elastic.out(1, 0.3)',
      })
    }
  }

  /* const intersects = raycaster.intersectObjects([
    object1,
    object2,
    object3,
  ]) */

  /* for (const object of [object1, object2, object3]) {
    object.material.color.set('#f00')
  } */

  /* for (const intersect of intersects) {
    intersect.object.material.color.set('#00f')
  } */

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
