import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// --- CONFIGURATION ---
const SCENE_OFFSET = 30; // Distance between scenes along Z-axis
const NEON_CYAN = 0x00f3ff;
const DEEP_BLACK = 0x080a0e;
const EMPHASIS_RED = 0xff4040;

// --- SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(DEEP_BLACK, 0.02);
scene.background = new THREE.Color(DEEP_BLACK);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Dynamic pixel ratio for performance
renderer.toneMapping = THREE.ReinhardToneMapping;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- POST PROCESSING ---
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.1;
bloomPass.strength = 0.8; // Subtle bloom
bloomPass.radius = 0.5;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft ambient
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 2);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

const backLight = new THREE.DirectionalLight(NEON_CYAN, 1.5);
backLight.position.set(-5, 5, -10); // Rim light logic
scene.add(backLight);

// --- SCENE OBJECTS FACTORY ---

// Helper function to create standard materials
const getMaterial = (color = NEON_CYAN, wireframe = false) => {
    return new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.4,
        metalness: 0.8,
        emissive: color,
        emissiveIntensity: 0.2,
        wireframe: wireframe
    });
};

const getGlassMaterial = () => {
    return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9,
        transparent: true,
        thickness: 0.5,
    });
};

// 1. INTRO: Abstract Tunnel/Grid
const introGroup = new THREE.Group();
const introGrid = new THREE.GridHelper(50, 50, NEON_CYAN, 0x111111);
introGrid.position.y = -5;
introGroup.add(introGrid);
scene.add(introGroup);

// 2. WEB DEV: Floating Interface Panels
const webGroup = new THREE.Group();
webGroup.position.set(-3, 0, -SCENE_OFFSET);

const webPanelGeo = new THREE.PlaneGeometry(3, 2);
const webPanelMat = getMaterial(NEON_CYAN, true);
const webPanel1 = new THREE.Mesh(webPanelGeo, webPanelMat);
webPanel1.position.set(0, 0, 0);

const webPanel2 = new THREE.Mesh(webPanelGeo, webPanelMat);
webPanel2.position.set(1, 1, -1);
webPanel2.scale.set(0.8, 0.8, 1);

webGroup.add(webPanel1, webPanel2);
scene.add(webGroup);

// 3. DESKTOP OF: Window Frames
const desktopGroup = new THREE.Group();
desktopGroup.position.set(3, 0, -SCENE_OFFSET * 2);

const windowFrameGeo = new THREE.BoxGeometry(4, 3, 0.2);
const windowFrameMat = getMaterial(0xffffff, false);
const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
const innerWindow = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.6, 0.25), new THREE.MeshStandardMaterial({ color: 0x111111 }));
windowFrame.add(innerWindow);

desktopGroup.add(windowFrame);
scene.add(desktopGroup);

// 4. EMBEDDED: PCB Board
const embeddedGroup = new THREE.Group();
embeddedGroup.position.set(0, -2, -SCENE_OFFSET * 3);

const pcbGeo = new THREE.BoxGeometry(5, 0.2, 5);
const pcbMat = new THREE.MeshStandardMaterial({ color: 0x1a3300, roughness: 0.6 });
const pcb = new THREE.Mesh(pcbGeo, pcbMat);

// Add chips
const chipGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5);
const chipMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
for (let i = 0; i < 5; i++) {
    const chip = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set((Math.random() - 0.5) * 4, 0.2, (Math.random() - 0.5) * 4);
    pcb.add(chip);

    // Blinking LED
    if (i % 2 === 0) {
        const led = new THREE.PointLight(EMPHASIS_RED, 1, 2);
        led.position.copy(chip.position);
        led.position.y += 0.2;
        pcb.add(led);

        // Custom animated property
        led.userData = { offset: Math.random() * 100 };
    }
}
embeddedGroup.add(pcb);
scene.add(embeddedGroup);

// 5. PROJECTS: Floating Cards
const projectGroup = new THREE.Group();
projectGroup.position.set(0, 0, -SCENE_OFFSET * 4);

const cardGeo = new THREE.BoxGeometry(2, 3, 0.1);
const cardMat = getMaterial(0x333333);
// Create 3 cards
for (let i = -1; i <= 1; i++) {
    const card = new THREE.Mesh(cardGeo, cardMat);
    card.position.set(i * 2.5, 0, 0);
    projectGroup.add(card);
}
scene.add(projectGroup);

// 6. BLOG: Books/Notes
const blogGroup = new THREE.Group();
blogGroup.position.set(-3, 0, -SCENE_OFFSET * 5);
const bookGeo = new THREE.BoxGeometry(2, 2.5, 0.5);
const bookMat = getGlassMaterial();
const book = new THREE.Mesh(bookGeo, bookMat);
blogGroup.add(book);
scene.add(blogGroup);

// 7. RESUME: Glass Panel
const resumeGroup = new THREE.Group();
resumeGroup.position.set(0, 0, -SCENE_OFFSET * 6);
const resumeDoc = new THREE.Mesh(new THREE.PlaneGeometry(3, 4), getGlassMaterial());
resumeGroup.add(resumeDoc);
scene.add(resumeGroup);

// 8. CONTACT: Simple connect
const contactGroup = new THREE.Group();
contactGroup.position.set(0, 0, -SCENE_OFFSET * 7);
// Maybe a sphere or network nodes
const sphereGeo = new THREE.IcosahedronGeometry(2);
const sphereMat = getMaterial(NEON_CYAN, true);
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
contactGroup.add(sphere);
scene.add(contactGroup);


// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    const time = clock.getElapsedTime();
    requestAnimationFrame(animate);

    // Idle animations
    introGrid.position.z = (time * 2) % 10;

    webGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
    webGroup.position.y = Math.sin(time) * 0.2; // Float

    desktopGroup.rotation.x = Math.sin(time * 0.3) * 0.1;

    embeddedGroup.rotation.y = time * 0.1;

    // Blink LEDs
    embeddedGroup.traverse((child) => {
        if (child.isPointLight) {
            child.intensity = Math.sin(time * 5 + child.userData.offset) > 0 ? 1.5 : 0;
        }
    });

    projectGroup.children.forEach((card, index) => {
        card.position.y = Math.sin(time * 1 + index) * 0.2;
    });

    contactGroup.rotation.y = time * 0.2;
    contactGroup.rotation.x = time * 0.1;

    composer.render();
}

// --- SCROLL LOGIC (GSAP) ---
gsap.registerPlugin(ScrollTrigger);

// Move Camera
const totalZ = SCENE_OFFSET * 7; // Total distance to travel
// We map the scroll of the entire page to the Z movement of the camera
// Each section is 100vh. Total 8 sections = 800vh (approx).

const sections = document.querySelectorAll('.scene');

// Camera Scroll
gsap.to(camera.position, {
    z: -totalZ,
    ease: "none",
    scrollTrigger: {
        trigger: "#ui-layer",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
    }
});

// Per-section animations (optional enhancements)
// We can trigger specific object animations when they come into view if needed.

// Fade in content
sections.forEach((section) => {
    const content = section.querySelector('.content');
    if (content) {
        gsap.to(content, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top center",
                end: "center center",
                toggleActions: "play reverse play reverse",
                scrub: true
            }
        });
    }
});


// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

animate();
