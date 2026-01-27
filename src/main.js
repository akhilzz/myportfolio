import * as THREE from 'three';
import { World } from './World/World.js';

// Main execution
class App {
    constructor() {
        console.log('App initialized');

        // Canvas container
        const container = document.querySelector('#canvas-container');

        // Create World
        this.world = new World(container);
    }
}

// Start app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
