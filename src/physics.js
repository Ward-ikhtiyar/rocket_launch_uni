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
export let A_side=diameter
let altitude = 0;
let layerName="Troposphere";
let wind_velocity=5;
let velocity=0;     
let velocityX=0;              //سرعة الصاروخ
let Pe=0;                         // الضغط عند فوهة العادم
let P0=0;                         // الضغط الخارجي 
let Ae=0;                         //نسبة توسع الفوهة  
let A_throat=0;                   //مساحة عنق الفوهة
let previousT;
let positionX = 0;            //
let animation_active = false;
let initial_rocket_y;
let rocket_ref;
let camera_ref;
let parachute_ref;
let parachute_deployed=false;
let temperature=288.15;
let pressure=101325;
let air_molar_mass=0.0289644; //kg/mol
let R=8.31432; //ثابت الغازات العام
let poweredAscentTime = 0;
let coastingAscentTime = 0;
let freeFallTime = 0;
let parachuteTime = 0;
let minDensity=0;
let maxVelocity=0;
let maxAltitude =0;
let earth_radius=6731000; //نصف قطر الارض بالمتر
export let parachute_Cd;
export let parachute_diameter;
const atmosphereLayers = [
   {
    name:"Troposphere",
    altitudeRange: [0, 11000],         // نطاق الارتفاع
    lapseRate: -0.0065,                // معدل تغير الحرارة 
    baseTemperature: 288.15,           // الحرارة الاساسية في هذه الطبقة 
    basePressure: 101325                //  الضغط الاساسي
  },
   {
    name:"Tropopause",
    altitudeRange: [11000, 20000],
    lapseRate: 0,
    baseTemperature: 216.65,
    basePressure: 22632.1
  },
  {
    name:"Stratosphere 1",
    altitudeRange: [20000, 32000],
    lapseRate: 0.001,
    baseTemperature: 216.65,
    basePressure: 5474.89
  },
   {
    name:"Stratosphere 2",
    altitudeRange: [32000, 47000],
    lapseRate: 0.0028,
    baseTemperature: 228.65,
    basePressure: 868.02
  },
   {
    name:"Stratopause",
    altitudeRange: [47000, 51000],
    lapseRate: 0,
    baseTemperature: 270.65,
    basePressure: 110.91
  },
  {
    name:"Mesosphere",
    altitudeRange: [51000, 71000],
    lapseRate: -0.0028,
    baseTemperature: 270.65,
    basePressure: 66.94
  },
   {
    name:"UpperMesosphere",
    altitudeRange: [71000, 86000],
    lapseRate: -0.002,
    baseTemperature: 214.65,
    basePressure: 3.96
  }
];


function getCurrentLayer(altitude) {
  let indexOfLayer = atmosphereLayers.findIndex(
    (layer) => altitude >= layer.altitudeRange[0] && altitude <= layer.altitudeRange[1]
  );

  if (indexOfLayer === -1) return null; 

  return atmosphereLayers[indexOfLayer];
}

function calculateGravity(altitude){
 let currentGarvity=g0*Math.pow(earth_radius/(earth_radius+altitude),2)
 return currentGarvity; 
}

function calculateAirDensity(altitude){
    let currentLayer=getCurrentLayer(altitude);
    layerName=currentLayer.name;
    let currentLayerBaseAltitude=currentLayer.altitudeRange[0];
    temperature=currentLayer.baseTemperature+currentLayer.lapseRate*(altitude-currentLayerBaseAltitude);
    if(currentLayer.lapseRate!==0){
        pressure=currentLayer.basePressure*Math.pow(currentLayer.baseTemperature/temperature,g0*air_molar_mass/(currentLayer.lapseRate*R))
    }
    if(currentLayer.lapseRate===0){
        pressure=currentLayer.basePressure*Math.exp(-g0*air_molar_mass*(altitude-currentLayerBaseAltitude)/(R*currentLayer.baseTemperature))
    }
    let newAirDensity=pressure/((R/air_molar_mass)*temperature);
    return newAirDensity
}

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

export function calculateRocketSpeed(deltaTime,altitude){
    
let total_mass=rocket_mass+fuel_mass;
let currentGarvity=calculateGravity(altitude)
let weight=total_mass*currentGarvity;
P = calculateAirDensity(altitude);
let drag = 0.5 * P * velocity * Math.abs(velocity) * Cd * A;
// let thrust=burnRate*(isp*currentGarvity)+(Pe-P0)*(A_throat*Ae);
let thrust=fuel_mass>0?(isp*currentGarvity)*burnRate:0;
let netForce=thrust-weight-drag;
let acceleration=netForce/total_mass;


velocity+=acceleration *deltaTime;
return velocity;
}

function calculateRocketSpeedHorizontal(deltaTime){
let total_mass=rocket_mass+fuel_mass;
let dragX = -0.5 * P * Cd * A_side * (velocityX - wind_velocity) * Math.abs(velocityX - wind_velocity);
let netForceX = dragX;
let accelerationX = netForceX / total_mass;
velocityX += accelerationX * deltaTime;
return velocityX;
}



function animate() {
    if (!animation_active) return;

    requestAnimationFrame(animate);

    const currentT = performance.now() / 1000;
    const deltaTime = currentT - previousT;
    previousT = currentT;

    

    if (fuel_mass > 0) {
        fuel_mass -= burnRate * deltaTime;
    } else {
        fuel_mass = 0;
    }

    let v = calculateRocketSpeed(deltaTime,altitude);
    let vx=calculateRocketSpeedHorizontal(deltaTime);

       if (fuel_mass > 0) {
    poweredAscentTime += deltaTime;
    } else if (velocity > 0) {
    coastingAscentTime += deltaTime;
    } else if (velocity < 0 && !parachute_deployed) {
    freeFallTime += deltaTime;
    } else if (parachute_deployed) {
    parachuteTime += deltaTime;
    }

    console.log(`fuel mass is :${fuel_mass}`);
     
    console.log(`Rocket Speed is :${v}`);

    console.log(`air density is :${P}`)

    if (rocket_ref && altitude < 100000 && altitude >=0) {
        altitude += v * deltaTime;
        positionX += vx * deltaTime;
        rocket_ref.position.y = initial_rocket_y + altitude;     
        rocket_ref.position.x = positionX;
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
    console.log(`positionX is ${positionX} `);
     if (altitude > maxAltitude) maxAltitude = altitude;
    if (Math.abs(velocity) > maxVelocity) maxVelocity = Math.abs(velocity);
    if (P < minDensity) minDensity = P;
    changeValues(altitude,v,fuel_mass,diameter,Cd,P,layerName);
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

