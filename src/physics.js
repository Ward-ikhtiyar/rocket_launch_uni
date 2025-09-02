import { changeValues } from "./controls";
import { reRenderScene } from "./main";

export let rocket_mass;       // وزن الصاروخ
export let fuel_mass;             // وزن الوقود
export let burnRate;               // معدل حرق الوقود
export let isp;                    // حسب نوع القود في هذه الحالة هو O2H2
export let g0;                     // جاذبية
export let Cd;                     // معامل مقاومة الشكل
export let P;                  // كثافة الهواء 
export let diameter = 2;                 // نصف قطر المقطع العرضي
export let A = Math.PI * (diameter / 2) ** 2;
let velocity=0;                   //سرعة الصاروخ
let Pe=0;                         // الضغط عند فوهة العادم
let P0=0;                         // الضغط الخارجي 
let Ae=0;                         //نسبة توسع الفوهة  
let A_throat=0;                   //مساحة عنق الفوهة
let previousT;
let animation_active = false;
let initial_rocket_y;
let rocket_ref;
let camera_ref;
let parachute_ref;
let parachute_deployed=false;
export let parachute_Cd;
export let parachute_diameter;

export function updatePhysicsParameters(newParams) {
    rocket_mass = newParams.rocket_mass;
    fuel_mass = newParams.fuel_mass;
    burnRate = newParams.burnRate;
    isp = newParams.isp;
    g0 = newParams.g0;
    Cd = newParams.Cd;
    P = newParams.P;
    parachute_Cd=newParams.parachute_Cd;
    parachute_diameter=newParams.parachute_diameter;
    diameter = newParams.diameter;
    A = Math.PI * (diameter / 2) ** 2;
    console.log(rocket_mass);
    console.log(fuel_mass);
    console.log(burnRate);
    console.log(g0);
}


export function resetToDefaults() {
    rocket_mass = 10000;
    fuel_mass = 30000;
    burnRate = 500;
    isp = 350;
    g0 = 9.81;
    Cd = 0.5;
    P = 1.225;
    diameter = 2;
    A = Math.PI * (diameter / 2) ** 2;
}

export function calculateRocketSpeed(deltaTime){
let total_mass=rocket_mass+fuel_mass;
let weight=total_mass*g0;
let drag = 0.5 * P * velocity * Math.abs(velocity) * Cd * A;

// let thrust=burnRate*(isp*g0)+(Pe-P0)*(A_throat*Ae);
let thrust=fuel_mass>0?(isp*g0)*burnRate:0;
let netForce=thrust-weight-drag;
let acceleration=netForce/total_mass;


velocity+=acceleration *deltaTime;
return velocity;
}



let altitude = 0;

function animate() {
    if (!animation_active) return;

    requestAnimationFrame(animate);

    const currentT = performance.now() / 1000;
    const deltaTime = currentT - previousT;
    previousT = currentT;

    let v = calculateRocketSpeed(deltaTime);

    if (fuel_mass > 0) {
        fuel_mass -= burnRate * deltaTime;
    } else {
        fuel_mass = 0;
    }
    console.log(`fuel mass is :${fuel_mass}`);
     
    console.log(`Rocket Speed is :${v}`);

    if (rocket_ref && altitude < 100000 && altitude >=0) {
        altitude += v * deltaTime * 0.01;
        rocket_ref.position.y = initial_rocket_y + altitude;
        camera_ref.position.y = initial_rocket_y + altitude;
        parachute_ref.position.y=initial_rocket_y+20 +altitude;
         if (v < 0 && parachute_deployed === false) {
    parachute_deployed = true;
    parachute_ref.visible = true;
    Cd = parachute_Cd;
    diameter = parachute_diameter;
    A = Math.PI * (diameter / 2) ** 2; 
    reRenderScene();
}

    
        reRenderScene();
    } else {
        animation_active = false; 
    }
    if(altitude<=0){
        v=0;
        parachute_deployed=false;
        parachute_ref.visible=false;
        reRenderScene();

    }
    changeValues(altitude,v,fuel_mass,diameter,Cd);
}

export function animateRocketUp(rocket,camera,parachute) {
    if (animation_active) return; 

    camera_ref=camera;
    rocket_ref = rocket;
    parachute_ref=parachute;
    initial_rocket_y = rocket.position.y;
    velocity = 0;
    altitude = 0; 
    previousT = performance.now() / 1000;
    animation_active = true;
    
    animate();
}
