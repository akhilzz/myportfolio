import * as THREE from 'three';

export class Lights {
    constructor(scene) {
        this.scene = scene;
        this.setupLights();
    }

    setupLights() {
        // Key Light (Main Subject Light) - Cool/Neutral
        this.keyLight = new THREE.DirectionalLight(0xffffff, 2);
        this.keyLight.position.set(5, 5, 5);
        this.scene.add(this.keyLight);

        // Rim Light (Backlight for Cinematic Edge) - Cyan/Blueish from User request
        this.rimLight = new THREE.SpotLight(0x00f3ff, 5);
        this.rimLight.position.set(-5, 5, -5);
        this.rimLight.lookAt(0, 0, 0);
        this.scene.add(this.rimLight);

        // Ambient Light (Soft Fill) - Deep Blue
        this.ambientLight = new THREE.AmbientLight(0x080a0e, 0.5);
        this.scene.add(this.ambientLight);
    }
}
