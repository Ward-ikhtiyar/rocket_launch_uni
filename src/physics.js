// Rocket Physics Variables - exported for UI access
export let rocket_mass = 10000;       // وزن الصاروخ
export let fuel_mass = 30000;             // وزن الوقود
export let burnRate = 500;               // معدل حرق الوقود
export let isp = 350;                    // حسب نوع القود في هذه الحالة هو O2H2
export let g0 = 9.81;                     // جاذبية
export let Cd = 0.5;                     // معامل مقاومة الشكل
export let P = 1.225;                  // كثافة الهواء 
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

// Function to update physics parameters from UI
export function updatePhysicsParameters(newParams) {
    rocket_mass = newParams.rocket_mass;
    fuel_mass = newParams.fuel_mass;
    burnRate = newParams.burnRate;
    isp = newParams.isp;
    g0 = newParams.g0;
    Cd = newParams.Cd;
    P = newParams.P;
    diameter = newParams.diameter;
    A = Math.PI * (diameter / 2) ** 2;
}

// Function to get current physics parameters for UI
export function getPhysicsParameters() {
    return {
        rocket_mass,
        fuel_mass,
        burnRate,
        isp,
        g0,
        Cd,
        P,
        diameter
    };
}

// Function to reset to default values
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
let drag=0.5*P*velocity**2*Cd*A* Math.sign(velocity);
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

    const v = calculateRocketSpeed(deltaTime);

    if (fuel_mass > 0) {
        fuel_mass -= burnRate * deltaTime;
    } else {
        fuel_mass = 0;
    }
     
    console.log(`Rocket Speed is :${v}`);
    if (rocket_ref && altitude < 100000) {
        altitude += v * deltaTime;
        rocket_ref.position.y = initial_rocket_y + altitude/50;
    } else {
        animation_active = false; 
    }
}

export function animateRocketUp(rocket) {
    if (animation_active) return; 

    rocket_ref = rocket;
    initial_rocket_y = rocket.position.y;
    velocity = 0;
    altitude = 0;
    fuel_mass = 30000; 
    previousT = performance.now() / 1000;
    animation_active = true;
    
    animate();
}
