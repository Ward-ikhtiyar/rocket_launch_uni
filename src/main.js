import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { removeAll } from 'three/examples/jsm/libs/tween.module.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { skyTexture } from './textures.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadRocket,loadLandingPad,loadSite } from './models.js';
import { animateRocketUp } from './physics.js';

const scene = new THREE.Scene();
const sphereMaterial=new THREE.MeshStandardMaterial({map:skyTexture,side:THREE.DoubleSide});
const sphere=new THREE.Mesh(new THREE.SphereGeometry(120, 90, 35), sphereMaterial);

sphere.position.y=-32;
sphere.position.x=10;
sphere.scale.y = 3; 
scene.add(sphere);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
camera.position.z = 5;
scene.add(camera);

const canvas = document.querySelector('.threejs');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new PointerLockControls(camera, canvas);

const moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up:false,
    down:false,
    fast:false,

};
const MOVE_SPEED = 0.3;
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

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', () => {
    controls.lock();
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

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);
let rocketPosition={x:-10, y:-128, z:20};

let rocket; 

loadRocket(scene, rocketPosition).then((loadedRocket) => {
    rocket = loadedRocket;

});

loadLandingPad(scene);
loadSite(scene);
// function animateRocketUp() {
//     function animate() {
//         requestAnimationFrame(animate);
//         if (rocket && rocket.position.y < 1000) {
//             rocket.position.y += 0.1;
//         }
//     }

//     animate();
// }



reLoop();


