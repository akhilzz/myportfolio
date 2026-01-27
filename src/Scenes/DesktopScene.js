import * as THREE from 'three';
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

export class DesktopScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.scene;
        this.group = new THREE.Group();
        this.scene.add(this.group);
        this.group.visible = false;

        this.createObjects();
        this.setupAnimation();
    }

    createObjects() {
        // More rigid, "System" like structures
        // Thicker borders, darker colors?
        const geometry = new THREE.BoxGeometry(4, 3, 0.2);
        const material = new THREE.MeshStandardMaterial({
            color: 0x1a1c23,
            roughness: 0.2,
            metalness: 0.8
        });

        this.mainWindow = new THREE.Mesh(geometry, material);
        this.mainWindow.position.set(-3, 0, -10);
        this.group.add(this.mainWindow);

        // Add a "Terminal" window
        const termGeo = new THREE.BoxGeometry(3, 2, 0.1);
        const termMat = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.5,
            metalness: 0.5
        });
        this.terminal = new THREE.Mesh(termGeo, termMat);
        this.terminal.position.set(1, 0.5, -9);
        this.group.add(this.terminal);

        // Wireframe edges for emphasis
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x404040 }));
        this.mainWindow.add(line);
    }

    setupAnimation() {
        ScrollTrigger.create({
            trigger: "#desktop-dev",
            start: "top bottom",
            end: "bottom top",
            onEnter: () => { this.group.visible = true; },
            onLeave: () => { this.group.visible = false; },
            onEnterBack: () => { this.group.visible = true; },
            onLeaveBack: () => { this.group.visible = false; }
        });

        gsap.to(this.mainWindow.rotation, {
            y: 0.2,
            scrollTrigger: {
                trigger: "#desktop-dev",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    update() {
        // specialized update
    }
}
