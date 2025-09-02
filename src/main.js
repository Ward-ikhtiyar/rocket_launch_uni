import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { removeAll } from "three/examples/jsm/libs/tween.module.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { skyTexture } from "./textures.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  loadRocket,
  loadLandingPad,
  loadSite,
  loadParachute,
  earth,
  stars,

} from "./models.js";
import { animateRocketUp } from "./physics.js";
import "./controls.js";

const scene = new THREE.Scene();

const sphereMaterial = new THREE.MeshStandardMaterial({
  map: skyTexture,
  side: THREE.BackSide,
  // fog : false
});
scene.fog = new THREE.FogExp2(0xaaaaaa, 0.006);
// const sphere=new THREE.Mesh(new THREE.SphereGeometry(180, 150,35), sphereMaterial);
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(150, 150, 35),
  sphereMaterial
);

sphere.position.y = -32;
sphere.position.x = 10;
sphere.scale.y = 1.5;
sphere.scale.x = 1.5;
sphere.scale.z = 1.5;

scene.add(sphere);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
);
camera.position.z = 25;
camera.position.x = 50;
camera.position.y = -135;
camera.lookAt(10, -128, 20);

scene.add(camera);

const canvas = document.querySelector(".threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new PointerLockControls(camera, canvas);

const moveState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false,
  fast: false,
};
const MOVE_SPEED = 0.7;
const FAST_MOVE_SPEED = 0.1;

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            moveState.forward = true;
            break;
        case 'KeyS':
            moveState.backward = true;
            break;
        case 'KeyA':
            moveState.left = true;
            break;
        case 'KeyD':
            moveState.right = true;
            break;
        case 'KeyQ':
            moveState.up = true;
            break;
        case 'ShiftLeft':
            moveState.down = true;
            break;
       case "KeyF":
        moveState.fast=true;
        break;
       case "KeyG":
        moveState.fast=false;
        break;
          case 'KeyP':
        controls.lock();
        break;
        case "KeyH":
            animateRocketUp(rocket);
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            moveState.forward = false;
            break;
        case 'KeyS': 
            moveState.backward = false;
            break;
        case 'KeyA':
            moveState.left = false;
            break;
        case 'KeyD':
            moveState.right = false;
            break;
        case 'KeyQ':
            moveState.up = false;
            break;
        case 'ShiftLeft':
            moveState.down = false;
            break;
        case 'KeyF':
            moveState.fast = false;
            break;
      
        case 'KeyG':
            moveState.fast = true;
            break;

    }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


    

const reLoop = () => {
    if (controls.isLocked) {
        if (moveState.forward) controls.moveForward(moveState.fast ? FAST_MOVE_SPEED : MOVE_SPEED);
        if (moveState.backward) controls.moveForward(-(moveState.fast ? FAST_MOVE_SPEED : MOVE_SPEED));
        if (moveState.left) controls.moveRight(-(moveState.fast ? FAST_MOVE_SPEED : MOVE_SPEED));
        if (moveState.right) controls.moveRight(moveState.fast ? FAST_MOVE_SPEED : MOVE_SPEED);
        if (moveState.up) camera.position.y += moveState.fast ? FAST_MOVE_SPEED : MOVE_SPEED;
        if (moveState.down) camera.position.y -= moveState.fast ? FAST_MOVE_SPEED : MOVE_SPEED;
    }
    
    controls.update();
    window.requestAnimationFrame(reLoop);
    renderer.render(scene, camera);
};
const sunLight = new THREE.DirectionalLight(0xffffff, 4.0);
sunLight.position.set(200, 300, -200);
sunLight.castShadow = true;
// const sunLightHelper=new THREE.DirectionalLightHelper(sunLight,1);
// scene.add(sunLightHelper);
scene.add(sunLight);
// scene.add(sunLightHelper);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
// const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
// scene.add(light);
let rocketPosition = { x: -10, y: -128, z: 20 };

let rocket;
let parachute;

loadRocket(scene, rocketPosition).then((loadedRocket) => {
  rocket = loadedRocket;
});

loadParachute(scene).then((loadedParachute) => {
  parachute = loadedParachute;
  parachute.visible = false;
});

export function reRenderScene() {
  renderer.render(scene, camera);
}

export function launchRocket() {
  console.log("wrad");
  animateRocketUp(rocket, camera, parachute);
}

loadLandingPad(scene);
loadSite(scene);
earth(scene);
stars(scene);
reLoop();
