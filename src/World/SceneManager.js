import * as THREE from 'three';
import { IntroScene } from '../Scenes/IntroScene.js';
import { WebDevScene } from '../Scenes/WebDevScene.js';
import { DesktopScene } from '../Scenes/DesktopScene.js';
import { EmbeddedScene } from '../Scenes/EmbeddedScene.js';
import { ProjectScene } from '../Scenes/ProjectScene.js';
import { InfoScene } from '../Scenes/InfoScene.js';
// GSAP is loaded via CDN in index.html, so it's available on window
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

export class SceneManager {
    constructor(world) {
        this.world = world;
        this.scene = world.scene;
        this.camera = world.camera.instance;

        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        this.scenes = [];
        this.setupScenes();
        // setupScrollAnimation is now handled within individual scenes or globally here
    }

    setupScenes() {
        // Initialize Scenes
        this.introScene = new IntroScene(this);
        this.scenes.push(this.introScene);

        this.webDevScene = new WebDevScene(this);
        this.scenes.push(this.webDevScene);

        this.desktopScene = new DesktopScene(this);
        this.scenes.push(this.desktopScene);

        this.embeddedScene = new EmbeddedScene(this);
        this.scenes.push(this.embeddedScene);

        this.projectScene = new ProjectScene(this);
        this.scenes.push(this.projectScene);

        this.infoScene = new InfoScene(this);
        this.scenes.push(this.infoScene);
    }

    update() {
        // Update all scenes
        this.scenes.forEach(scene => {
            if (scene.update) scene.update();
        });
    }
}
