import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mod } from "three/src/nodes/TSL.js";

const loader = new GLTFLoader();

export const loadRocket = (scene, position) => {
  return new Promise((resolve, reject) => {
    loader.load(
      "public/models/scene.gltf",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(position.x, position.y, position.z);
        model.scale.set(10, 10, 10);
        scene.add(model);
        resolve(model);
        model.traverse((child) => {
        if (child.isMesh) {
          child.material.fog = false; // ✅ هذا يخلي الضباب يطبق على هذا الجسم
        }
      });
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        reject(error);
      }
    );
  });
};

export const loadLandingPad = (scene) => {
  loader.load(
    "public/models/landing_pad/scene.gltf",
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      model.position.set(-10, -138, 20);
      model.scale.set(10, 10, 10);
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.fog = true; // ✅ هذا يخلي الضباب يطبق على هذا الجسم
        }
      });
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );
};
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
export const loadSite = (scene) => {
  loader.load(
    "public/models/island/scene.gltf",
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      // model.rotation.x = -Math.PI/2;
      model.position.set(-45, -128, -40);
      model.scale.set(250, 250, 250);
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.fog = true; // ✅ هذا يخلي الضباب يطبق على هذا الجسم
        }
      });
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );
};

export const loadParachute = (scene) => {
  return new Promise((resolve, reject) => {
    loader.load(
      "public/models/parachute/scene.gltf",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(-10, -108, 20);
        model.scale.set(12, 12, 12);
        scene.add(model);
        resolve(model);
        model.traverse((child) => {
        if (child.isMesh) {
          child.material.fog = false; // ✅ هذا يخلي الضباب يطبق على هذا الجسم
        }
      });
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        reject(error);
      }
    );
  });
};
export const earth = (scene) => {
  return new Promise((resolve, reject) => {
    loader.load(
      "public/models/earth/scene.gltf",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(-12, -108, 20);
        model.scale.set(300, 300, 300);
        model.rotation.set(30, 0, 0);
        scene.add(model);
        resolve(model);
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.side = THREE.FrontSide; // أو BackSide حسب المطلوب
            child.material.fog = false
          }
        });
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        reject(error);
      }
    );
  });
};

export const stars = (scene) => {
  return new Promise((resolve, reject) => {
    loader.load(
      "public/models/stars/scene.gltf",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(-10, -108, 20);
        model.scale.set(12, 12, 12);
        scene.add(model);
        resolve(model);
        model.traverse((child) => {
        if (child.isMesh) {
          child.material.fog = false; // ✅ هذا يخلي الضباب يطبق على هذا الجسم
        }
      });
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        reject(error);
      }
    );
  });
};
