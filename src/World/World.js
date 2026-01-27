import * as THREE from 'three';
import { Lights } from './Lights.js';
import { SceneManager } from './SceneManager.js';
import { Camera } from './Camera.js';
import { PostProcessing } from './PostProcessing.js';

export class World {
    constructor(container) {
        this.container = container;
        console.log('World initialized');

        // Order matters: Scene -> Camera -> Renderer -> Helpers
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x080a0e, 0.02);

        this.camera = new Camera(this);

        this.setupRenderer();

        this.lights = new Lights(this.scene);
        this.sceneManager = new SceneManager(this);

        // Post Processing
        this.postProcessing = new PostProcessing(this);

        this.onWindowResize();
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x080a0e, 1);

        // Append to container
        this.container.appendChild(this.renderer.domElement);

        // Render Loop
        this.renderer.setAnimationLoop(() => {
            this.sceneManager.update();
            this.postProcessing.render();
        });
    }

    onWindowResize() {
        this.camera.onWindowResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (this.postProcessing) this.postProcessing.setSize(window.innerWidth, window.innerHeight);
    }
}
