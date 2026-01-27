import * as THREE from 'three';
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

export class EmbeddedScene {
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
        // PCB Style Geometry
        // A flat plane with "chips" on it
        const boardGeo = new THREE.BoxGeometry(4, 4, 0.1);
        const boardMat = new THREE.MeshStandardMaterial({
            color: 0x003300, // Very dark green/black
            roughness: 0.4,
            metalness: 0.1
        });
        this.board = new THREE.Mesh(boardGeo, boardMat);
        this.board.position.set(0, 0, -5);
        this.group.add(this.board);

        // Chips
        const chipGeo = new THREE.BoxGeometry(0.5, 0.5, 0.2);
        const chipMat = new THREE.MeshStandardMaterial({ color: 0x111111 }); // Black chip

        for (let i = 0; i < 5; i++) {
            const chip = new THREE.Mesh(chipGeo, chipMat);
            chip.position.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, 0.15);
            this.board.add(chip);
        }

        // Trace lines (visualized as particles or simple lines)
        // A blinking LED
        const ledGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const ledMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.led = new THREE.Mesh(ledGeo, ledMat);
        this.led.position.set(1.5, 1.5, 0.2);
        this.board.add(this.led);
    }

    setupAnimation() {
        ScrollTrigger.create({
            trigger: "#embedded",
            start: "top bottom",
            end: "bottom top",
            onEnter: () => { this.group.visible = true; },
            onLeave: () => { this.group.visible = false; },
            onEnterBack: () => { this.group.visible = true; },
            onLeaveBack: () => { this.group.visible = false; }
        });

        // Rotate board
        gsap.to(this.board.rotation, {
            x: 0.5,
            y: 0.5,
            scrollTrigger: {
                trigger: "#embedded",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Blink LED
        gsap.to(this.led.material, {
            opacity: 0.2,
            duration: 0.5,
            yoyo: true,
            repeat: -1
        });
    }

    update() {
        //
    }
}
