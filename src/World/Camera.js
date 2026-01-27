import * as THREE from 'three';

export class Camera {
    constructor(world) {
        this.world = world;
        this.container = world.container;

        this.setupCamera();
    }

    setupCamera() {
        this.instance = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
        this.instance.position.set(0, 0, 10);
        this.world.scene.add(this.instance);
    }

    onWindowResize() {
        this.instance.aspect = window.innerWidth / window.innerHeight;
        this.instance.updateProjectionMatrix();
    }
}
