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

// --- Texture ---
const simpleShadow = new THREE.TextureLoader().load("/public/texture/simpleShadow.jpg")

// --- Objects ---
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI),
    new THREE.MeshStandardMaterial()
)
sphere.position.y = 1
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12, 1, 1),
    new THREE.MeshStandardMaterial()
)
plane.rotation.x = - Math.PI/2
plane.position.y = -1
plane.receiveShadow = true

scene.add(sphere, plane)

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({
        color : "black",
        transparent : true,
        alphaMap : simpleShadow
    })
)
sphereShadow.rotation.x = - Math.PI/2
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphereShadow)

// --- Light ---
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 2, -1)
directionalLight.castShadow = true

directionalLight.shadow.mapSize.width = 1024/2
directionalLight.shadow.mapSize.height = 1024/2
directionalLight.shadow.camera.top = 5
directionalLight.shadow.camera.right = 5
directionalLight.shadow.camera.bottom = -5
directionalLight.shadow.camera.left = -5

directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 10
directionalLight.shadow.camera.updateProjectionMatrix()

directionalLight.shadow.radius = 50

scene.add(directionalLight)

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 10, 10, Math.PI* 0.3)
spotLight.position.set(-3, 2, -2)
spotLight.target.position.set(0, 0, 0);
spotLight.castShadow = true
spotLight.visible = false

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
pointLight.visible = false

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 10

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

// --- Debug UI ---
const gui = new GUI
gui.close()
gui.add(ambientLight, "intensity").min(0).max(5).step(0.01).name("Ambient Light Intensity")
gui.add(axesHelper, 'visible').name("Axes Helper")
gui.add(sphereShadow, 'visible').name('Enable Baking Shadow')
gui.add(renderer.shadowMap, 'enabled')
    .name("Enable Real Shadows")
    .onChange(() => {
        directionalLight.castShadow = renderer.shadowMap.enabled
        spotLight.castShadow = renderer.shadowMap.enabled
        pointLight.castShadow = renderer.shadowMap.enabled
    })

const directionalLightShadow = gui.addFolder("Directional Light")
directionalLightShadow.add(directionalLight, 'visible').name("Directional Light")
directionalLightShadow.add(directionalLight, "intensity").min(0).max(5).step(0.01).name("Directional Light Intensity")
directionalLightShadow.add(directionalLightHelper, 'visible').name("Directional Light Helper")
directionalLightShadow.add(directionalLightCameraHelper, 'visible').name("Directional Light Camera Helper")

const spotLightShadow = gui.addFolder("Spot Light")
spotLightShadow.add(spotLight, 'visible').name("Spot Light")
spotLightShadow.add(spotLight, 'intensity').min(0).max(20).step(0.01).name("Spot Light Intensity")
spotLightShadow.add(spotLightHelper, 'visible').name("Spot Light Helper")
spotLightShadow.add(spotLightCameraHelper, 'visible').name("Spot Light Camera Helper")

const pointLightShadow = gui.addFolder("Point Light")
pointLightShadow.add(pointLight, 'visible').name("Point Light")
pointLightShadow.add(pointLight, 'intensity').min(0).max(20).step(0.01).name("Point Light Intensity")
pointLightShadow.add(pointLightHelper, 'visible').name("Point Light Helper")
pointLightShadow.add(pointLightCameraHelper, 'visible').name("Point Light Camera Helper")

// --- Resize ---
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// --- Render Loop ---
const clock = new THREE.Clock()

function animate(){
    // Clock
    const elapsedTime = clock.getElapsedTime()

    // Update the sphere
    sphere.position.x = Math.cos(elapsedTime) * 3
    sphere.position.z = Math.sin(elapsedTime) * 3
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 4))

    // Update the shadow
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

    // Update control
    controls.update()

    // Update render
    renderer.render(scene, camera);

    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
}
animate()
