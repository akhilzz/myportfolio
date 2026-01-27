import * as THREE from 'three';

export class IntroScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.scene;
        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.createEnvironment();
        this.setupAnimation();
    }

    // Minimal abstract environment
    // A subtle grid or particles to give depth
    const geometry = new THREE.BufferGeometry();
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 50 : 200;
    const positions = new Float32Array(count * 3);

    for(let i = 0; i <count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20; // Spread -10 to 10
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true
});

this.particles = new THREE.Points(geometry, material);
this.group.add(this.particles);
    }

setupAnimation() {
    // Intro Animation driven by ScrollTrigger
    // As we scroll through #intro, move camera or particles
    const gsap = window.gsap;

    // Gentle forward movement simulation
    gsap.to(this.particles.position, {
        z: 5,
        ease: "none",
        scrollTrigger: {
            trigger: "#intro",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}

update() {
    // Idle animation
    this.particles.rotation.y += 0.001;
}
}
