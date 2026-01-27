import * as THREE from 'three';

// --- THREE.JS INITIALIZATION ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x0ea5e9, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const secondaryLight = new THREE.PointLight(0x6366f1, 2);
secondaryLight.position.set(-5, -5, 2);
scene.add(secondaryLight);

// --- 3D ELEMENTS ---
// Create an abstract tech core (representing Embedded Systems)
const group = new THREE.Group();
scene.add(group);

// Central sphere
const geometry = new THREE.IcosahedronGeometry(2, 2);
const material = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const core = new THREE.Mesh(geometry, material);
group.add(core);

// Inner core
const innerGeo = new THREE.IcosahedronGeometry(1.2, 1);
const innerMat = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    emissive: 0x6366f1,
    emissiveIntensity: 2,
    roughness: 0
});
const innerCore = new THREE.Mesh(innerGeo, innerMat);
group.add(innerCore);

// Floating particles
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 40;
}
const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x0ea5e9,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

camera.position.z = 8;

// --- CUSTOM CURSOR LOGIC ---
const cursor = document.createElement('div');
cursor.className = 'fixed w-8 h-8 pointer-events-none z-[9999] rounded-full border border-primary/50 mix-blend-difference hidden md:block transition-all duration-300';
cursor.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(cursor);

// --- INTERACTIVE MOUSE MOVEMENT ---
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;

    // Custom cursor movement
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

// Cursor interaction
document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 1.5, backgroundColor: 'rgba(14, 165, 233, 0.2)', backdropFilter: 'blur(4px)' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', backdropFilter: 'none' });
    });
});

// --- SCROLL PROGRESS BAR ---
const progressBar = document.createElement('div');
progressBar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary z-[100] transition-all duration-300';
progressBar.style.width = '0%';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
});

// --- GSAP ANIMATIONS & SCROLL EFFECTS ---
gsap.registerPlugin(ScrollTrigger);

// Hero Fade In
gsap.to('.hero-fade', {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power2.out",
    delay: 0.5
});

// 3D Motion on Scroll
gsap.to(group.rotation, {
    y: Math.PI * 4,
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

gsap.to(camera.position, {
    z: 12,
    scrollTrigger: {
        trigger: "#expertise",
        start: "top bottom",
        end: "top top",
        scrub: 1
    }
});

// Individual Section Reveal Animations
const revealSections = [
    { id: '#expertise', cards: '.glass-card' },
    { id: '#projects', cards: '.project-card' },
    { id: '#resume', cards: '.glass-card' },
    { id: '#services', cards: '.glass-card' },
    { id: '#mentorship', cards: '.glass-card' }
];

revealSections.forEach(section => {
    // Animate Titles
    gsap.from(`${section.id} h2`, {
        scrollTrigger: {
            trigger: `${section.id} h2`,
            start: "top 95%",
            once: true
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    // Animate Cards with a more sensitive trigger
    gsap.from(`${section.id} ${section.cards}`, {
        scrollTrigger: {
            trigger: section.id,
            start: "top 90%", // Fire as soon as section top is near bottom
            once: true
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });
});

// Fallback: Ensure everything is visible after a delay if GSAP fails
setTimeout(() => {
    gsap.to('.glass-card, .project-card, h2', { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, overwrite: 'auto' });
    console.log("Visibility fallback triggered.");
}, 3000);

console.log("Portfolio reveal animations initialized.");

// Refresh triggers after content loads
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

// --- ANIMATION LOOP ---
const animate = () => {
    requestAnimationFrame(animate);

    // Smooth idle rotation
    group.rotation.x += 0.005;
    group.rotation.y += 0.005;

    // Mouse follow effect
    group.position.x += (mouseX * 2 - group.position.x) * 0.05;
    group.position.y += (mouseY * 2 - group.position.y) * 0.05;

    // Smoothing
    innerCore.material.emissiveIntensity = 1 + Math.sin(Date.now() * 0.002) * 1;

    // Multi-color shift based on scroll (with safety check)
    const scrollMax = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollMax > 0 ? window.scrollY / scrollMax : 0;
    pointLight.color.setHSL(0.5 + scrollPercent * 0.2, 0.8, 0.5);

    renderer.render(scene, camera);
};

animate();

// --- RESIZE HANDLER ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
