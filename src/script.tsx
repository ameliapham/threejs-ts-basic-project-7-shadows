import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from "lil-gui"

console.log("Hello, Three.js with TypeScript!");

// --- Canvas Setup ---
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// --- Scene Setup ---
const scene = new THREE.Scene();

// --- Setup Axes Helper ---
 const axesHelper = new THREE.AxesHelper(2)
 scene.add(axesHelper)

// --- Objects ---
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI),
    new THREE.MeshStandardMaterial()
)
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12, 1, 1),
    new THREE.MeshStandardMaterial()
)
plane.rotation.x = - Math.PI/2
plane.position.y = -3
plane.receiveShadow = true

scene.add(sphere, plane)

// --- Light ---
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 2, -1)
directionalLight.castShadow = true

scene.add(ambientLight, directionalLight)

directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2

directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 10

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

// --- Lights Helpers ---
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

// --- Debug UI ---
const gui = new GUI
gui.add(ambientLight, "intensity").min(0).max(5).step(0.01).name("Ambient Light Intensity")
gui.add(directionalLight, "intensity").min(0).max(5).step(0.01).name("Directional Light Intensity")

// --- Camera Setup ---
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight);
camera.position.z = 8
scene.add(camera)

// --- Controls ---
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// --- Renderer Setup ---
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

// --- Resize ---
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// --- Render Loop ---
function animate(){
    controls.update()
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate)
}
animate()
