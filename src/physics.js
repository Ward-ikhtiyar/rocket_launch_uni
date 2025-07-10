

 let rocket_mass = 10000;       // وزن الصاروخ
    let fuel_mass = 30000;             // وزن الوقود
    let burnRate = 500;               // معدل حرق الوقود
    let isp = 350;                    // حسب نوع القود في هذه الحالة هو O2H2
    let g0 = 9.81;                     // جاذبية
    let Cd = 0.5;                     // معامل مقاومة الشكل
    let P = 1.225;                  // كثافة الهواء 
    let diameter = 2;                 // نصف قطر المقطع العرضي
    let A = Math.PI * (diameter / 2) ** 2;
    let velocity=0;                   //سرعة الصاروخ
    let Pe=0;                         // الضغط عند فوهة العادم
    let P0=0;                         // الضغط الخارجي 
    let Ae=0;                         //نسبة توسع الفوهة  
    let A_throat=0;                   //مساحة عنق الفوهة
    let previousT;
    let animation_active = false;
    let initial_rocket_y;
    let rocket_ref;

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
