import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export const loadRocket = (scene, position) => {
    return new Promise((resolve, reject) => {
        loader.load('public/models/scene.gltf', (gltf) => {
            const model = gltf.scene;
            model.position.set(position.x, position.y, position.z);
            model.scale.set(10, 10, 10);
            scene.add(model);
            resolve(model); 
        }, undefined, (error) => {
            console.error('Error loading model:', error);
            reject(error);
        });
    });
};

export const loadLandingPad=(scene)=>{
    loader.load('public/models/landing_pad/scene.gltf', (gltf) => {
        const model = gltf.scene;
        scene.add(model);
    
        model.position.set(-10, -138, 20); 
        model.scale.set(10, 10, 10);
    }, undefined, (error) => {
        console.error('Error loading model:', error);
    });
}
// export const loadSite=(scene)=>{
//     loader.load('public/models/site/scene.gltf', (gltf) => {
//         const model = gltf.scene;
//         scene.add(model);
//         model.rotation.x = -Math.PI/2;
//         model.position.set(0, -100, 0); 
//         model.scale.set(1, 1, 1);
//     }, undefined, (error) => {
//         console.error('Error loading model:', error);
//     });
// }
export const loadSite=(scene)=>{
    loader.load('public/models/island/scene.gltf', (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        // model.rotation.x = -Math.PI/2;
        model.position.set(-45, -128, -40); 
        model.scale.set(200, 200, 200);
    }, undefined, (error) => {
        console.error('Error loading model:', error);
    });
}

export const loadParachute = (scene) => {
    return new Promise((resolve, reject) => {
        loader.load('public/models/parachute/scene.gltf', (gltf) => {
            const model = gltf.scene;
            model.position.set(-10, -108, 20); 
            model.scale.set(12, 12, 12);
            scene.add(model);
            resolve(model); 
        }, undefined, (error) => {
            console.error('Error loading model:', error);
            reject(error);
        });
    });
};