import * as THREE from 'three';
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

export class InfoScene {
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
        // Minimal background elements for Blog, Resume, Contact
        // Maybe some floating glass spheres or shards

        // Blog: Floating Papers/Panels
        const paperGeo = new THREE.PlaneGeometry(5, 7);
        const paperMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.4,
            metalness: 0.1,
            transparent: true,
            opacity: 0.05,
            side: THREE.DoubleSide
        });
        this.paper = new THREE.Mesh(paperGeo, paperMat);
        this.paper.position.set(3, 0, -10); // Right side
        this.group.add(this.paper);

        // Resume: Glass Monolith
        const monolithGeo = new THREE.BoxGeometry(2, 6, 2);
        const monolithMat = new THREE.MeshPhysicalMaterial({
            roughness: 0,
            transmission: 1,
            thickness: 0.5,
            color: 0x00f3ff
        });
        this.monolith = new THREE.Mesh(monolithGeo, monolithMat);
        this.monolith.position.set(0, -5, -12); // Start below
        this.group.add(this.monolith);

        // Contact: Connection Lines
        this.linesGroup = new THREE.Group();
        // Create simple line network
        const points = [];
        for (let i = 0; i < 10; i++) {
            points.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, -5));
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.3 });
        this.lines = new THREE.Line(lineGeo, lineMat);
        this.linesGroup.add(this.lines);
        this.group.add(this.linesGroup);
    }

    setupAnimation() {
        // Manage visibility across the last 3 sections
        // It's a bit hacky to use one scene for three, but efficient for "Misc"

        // Blog Trigger
        ScrollTrigger.create({
            trigger: "#blog",
            start: "top bottom",
            onEnter: () => {
                this.group.visible = true;
                this.paper.visible = true;
                this.monolith.visible = false;
                this.linesGroup.visible = false;
            },
            onLeaveBack: () => { this.paper.visible = false; }
        });

        // Resume Trigger
        ScrollTrigger.create({
            trigger: "#resume",
            start: "top center",
            onEnter: () => {
                this.paper.visible = false;
                this.monolith.visible = true;
                this.linesGroup.visible = false;

                // Animate Monolith up
                gsap.fromTo(this.monolith.position, { y: -10 }, { y: 0, duration: 1.5, ease: "power2.out" });
            },
            onLeaveBack: () => {
                this.monolith.visible = false;
                this.paper.visible = true;
            }
        });

        // Contact Trigger
        ScrollTrigger.create({
            trigger: "#contact",
            start: "top center",
            onEnter: () => {
                this.monolith.visible = false;
                this.linesGroup.visible = true;

                // Animate lines
                gsap.from(this.linesGroup.rotation, { z: Math.PI, duration: 2 });
            },
            onLeaveBack: () => {
                this.linesGroup.visible = false;
                this.monolith.visible = true;
            }
        });
    }

    update() {
        this.paper.rotation.y += 0.002;
        this.monolith.rotation.y += 0.005;
        this.linesGroup.rotation.x += 0.001;
    }
}
