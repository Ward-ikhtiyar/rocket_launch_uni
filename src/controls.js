import { animateRocketUp,parachute_Cd,parachute_diameter,resetToDefaults,updatePhysicsParameters } from './physics.js';
import { launchRocket } from './main.js';

    document.getElementById('apply-changes').addEventListener('click', () => {
        console.log("brh check dis")
        console.log(document.getElementById('fuel-mass').value);
    let rocket =  {
            rocket_mass:parseFloat(document.getElementById('rocket-mass').value),
            fuel_mass:parseFloat(document.getElementById('fuel-mass').value),
            burnRate:parseFloat(document.getElementById('burn-rate').value),
            isp :parseFloat(document.getElementById('isp').value),
            g0:parseFloat(document.getElementById('gravity').value),
            Cd:parseFloat(document.getElementById('drag-coefficient').value),
            diameter : parseFloat(document.getElementById('diameter').value),
            P:parseFloat(document.getElementById('air-density').value),
            parachute_Cd:parseFloat(document.getElementById('parachute-drag-coefficient').value),
            parachute_diameter:parseFloat(document.getElementById('parachute-diameter').value),
        }
            console.log(rocket);
        updatePhysicsParameters(rocket);

        
    });

document.getElementById('reset-defaults').addEventListener('click', () => {
    document.getElementById('rocket-mass').value = 1000;
    document.getElementById('fuel-mass').value = 1000;
    document.getElementById('burn-rate').value = 500;
    document.getElementById('isp').value = 350;
    document.getElementById('drag-coefficient').value = 0.5;
    document.getElementById('diameter').value = 2;
    document.getElementById('gravity').value = 9.81;
    document.getElementById('air-density').value = 1.225;
    document.getElementById('parachute-drag-coefficient')=1.5;
    document.getElementById('parachute-diameter')=3;
    resetToDefaults();
});

document.getElementById('launch-btn').addEventListener('click', () => {console.log('ward');launchRocket();});
document.getElementById('toggle-btn').addEventListener('click', () => {
    const panelContent = document.getElementById('panel-content');
    const toggleBtn = document.getElementById('toggle-btn');

    
    
    if (panelContent.style.height === '0px' || panelContent.style.height === '') {
        panelContent.style.opacity = '1';
        const scrollHeight = panelContent.scrollHeight;
        panelContent.style.height = scrollHeight + 'px';        
        panelContent.style.overflow = 'auto';
        toggleBtn.textContent = '−';
        
        
    } else {
        panelContent.style.overflow = 'hidden';
        panelContent.style.height = '0px';
        panelContent.style.opacity = '0';
        toggleBtn.textContent = '+';
    }
});

export function changeValues(alt,vel,fuel_mass,diameter,Cd,airDensity,layerName){
    console.log('Updating values:', alt, vel, fuel_mass);
    document.getElementById("altitude-value").textContent = Math.round(alt * 100).toFixed(2);
    document.getElementById("velocity-value").textContent = Math.round(vel).toFixed(2);
    document.getElementById("fuel-value").textContent = Math.round(fuel_mass);
    document.getElementById('diameter-value').textContent=diameter;
    document.getElementById('drag-coefficient-value').textContent=Cd;
    document.getElementById("layer-value").textContent = layerName;
    document.getElementById("air-density-value").textContent = airDensity.toFixed(7);
    // let layer = "Ground";
    // if (alt > 11000) layer = "Stratosphere";
    // else if (alt > 0) layer = "Troposphere";
    
    // document.getElementById("layer-value").textContent = layer;
    
    // let airDensity = 1.225;
    // if (alt > 0) {
    //     airDensity = 1.225 * Math.exp(-alt / 7400);
    // }
    // document.getElementById("air-density-value").textContent = airDensity.toFixed(3);
}

