import * as THREE from 'three';
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

export class ProjectScene {
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
        // 3 floating cards representing projects
        // They should align with the DOM grid
        this.cards = [];

        const cardGeo = new THREE.PlaneGeometry(3, 4);
        const cardMat = new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 0.1,
            metalness: 0.9,
            side: THREE.DoubleSide
        });

        // Loop to create 3 cards
        for (let i = 0; i < 3; i++) {
            const card = new THREE.Mesh(cardGeo, cardMat);
            // Distribute them: Center, Left, Right or just scattered
            // Visual alignment with DOM is tricky without raycasting, 
            // so we keep them as background elements for mood.
            card.position.set((i - 1) * 4, 0, -10);

            // Add a "Screen" glow
            const screenGeo = new THREE.PlaneGeometry(2.5, 2);
            const screenMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.1 });
            const screen = new THREE.Mesh(screenGeo, screenMat);
            screen.position.set(0, 0.5, 0.01);
            card.add(screen);

            this.group.add(card);
            this.cards.push(card);
        }
    }

    setupAnimation() {
        ScrollTrigger.create({
            trigger: "#projects",
            start: "top bottom",
            end: "bottom top",
            onEnter: () => { this.group.visible = true; },
            onLeave: () => { this.group.visible = false; },
            onEnterBack: () => { this.group.visible = true; },
            onLeaveBack: () => { this.group.visible = false; }
        });

        // Hover effect simulation or just nice idle movement
        this.cards.forEach((card, i) => {
            gsap.to(card.position, {
                y: 1,
                duration: 2 + i,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });

            // Interaction: Rotate slightly on scroll
            gsap.to(card.rotation, {
                y: (i - 1) * 0.5,
                scrollTrigger: {
                    trigger: "#projects",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }

    update() {
        // 
    }
}
