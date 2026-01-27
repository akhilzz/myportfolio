import * as THREE from 'three';
const gsap = window.gsap;

export class WebDevScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.scene;
        this.group = new THREE.Group();
        this.scene.add(this.group);

        // Initially hide or positon far away
        this.group.visible = false;

        this.createObjects();
        this.setupAnimation();
    }

    createObjects() {
        // Floating Wireframe Panels representing Browser Windows
        const geometry = new THREE.PlaneGeometry(3, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00f3ff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        this.panel1 = new THREE.Mesh(geometry, material);
        this.panel1.position.set(-2, 0, -5);
        this.group.add(this.panel1);

        this.panel2 = new THREE.Mesh(geometry, material);
        this.panel2.position.set(2, 1, -8);
        this.group.add(this.panel2);

        // Code snippets or abstract lines on panels
        // For simplicity, just smaller lines
        const lineGeo = new THREE.PlaneGeometry(2, 0.1);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xe0e0e0, side: THREE.DoubleSide });

        for (let i = 0; i < 5; i++) {
            const line = new THREE.Mesh(lineGeo, lineMat);
            line.position.y = 0.5 - (i * 0.3);
            line.position.z = 0.01;
            this.panel1.add(line);
        }
    }

    setupAnimation() {
        // Scene 2 Trigger
        ScrollTrigger.create({
            trigger: "#web-dev",
            start: "top bottom",
            end: "bottom top",
            onEnter: () => { this.group.visible = true; },
            onLeave: () => { this.group.visible = false; },
            onEnterBack: () => { this.group.visible = true; },
            onLeaveBack: () => { this.group.visible = false; }
        });

        // Parallax / Movement
        gsap.to(this.panel1.position, {
            y: 1,
            rotation: 0.1,
            ease: "none",
            scrollTrigger: {
                trigger: "#web-dev",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(this.panel2.position, {
            y: -1,
            rotation: -0.1,
            ease: "none",
            scrollTrigger: {
                trigger: "#web-dev",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    update() {
        // Floating effect
        this.panel1.rotation.y = Math.sin(Date.now() * 0.001) * 0.05;
        this.panel2.rotation.y = Math.cos(Date.now() * 0.001) * 0.05;
    }
}
