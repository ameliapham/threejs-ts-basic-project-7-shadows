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
 axesHelper.visible = false
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
plane.position.y = -1
plane.receiveShadow = true

scene.add(sphere, plane)

// --- Light ---
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 2, -1)
directionalLight.castShadow = true
scene.add(directionalLight)

directionalLight.shadow.mapSize.width = 1024/2
directionalLight.shadow.mapSize.height = 1024/2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2

directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 10

//directionalLight.shadow.radius = 50

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 10, 10, Math.PI* 0.3)
spotLight.position.set(-3, 2, -2)
spotLight.target.position.set(0, 0, 0);
spotLight.castShadow = true

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 10;

scene.add(spotLight)
scene.add(spotLight.target)

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 5, 0, 2)
pointLight.position.set(-1, 3, 0)
pointLight.castShadow = true

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

scene.add(pointLight)

// --- Lights Helpers ---
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
directionalLightHelper.visible = false

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightHelper, directionalLightCameraHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2)
spotLightHelper.visible = false

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightHelper, spotLightCameraHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
pointLightHelper.visible = false

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightHelper, pointLightCameraHelper)

// --- Debug UI ---
const gui = new GUI
gui.add(ambientLight, "intensity").min(0).max(5).step(0.01).name("Ambient Light Intensity")
gui.add(directionalLight, "intensity").min(0).max(5).step(0.01).name("Directional Light Intensity")
gui.add(spotLight, 'intensity').min(0).max(20).step(0.01).name("Spot Light Intensity")
gui.add(pointLight, 'intensity').min(0).max(20).step(0.01).name("Point Light Intensity")

const helpers = gui.addFolder("Helpers")
helpers.add(axesHelper, 'visible').name("Axes Helper")
helpers.add(directionalLightHelper, 'visible').name("Directional Light Helper")
helpers.add(directionalLightCameraHelper, 'visible').name("Directional Light Camera Helper")
helpers.add(spotLightHelper, 'visible').name("Spot Light Helper")
helpers.add(spotLightCameraHelper, 'visible').name("Spot Light Camera Helper")
helpers.add(pointLightHelper, 'visible').name("Point Light Helper")
helpers.add(pointLightCameraHelper, 'visible').name("Point Light Camera Helper")



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
renderer.shadowMap.type = THREE.PCFSoftShadowMap

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
