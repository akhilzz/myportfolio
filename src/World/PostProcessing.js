import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Simple Noise Shader for Film Grain
const NoiseShader = {
    uniforms: {
        "tDiffuse": { value: null },
        "amount": { value: 0.05 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    fragmentShader: `
        uniform float amount;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        
        float random( vec2 p ) {
            vec2 K1 = vec2(
                23.14069263277926, // e^pi (Gelfond's constant)
                2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
            );
            return fract( cos( dot(p,K1) ) * 12345.6789 );
        }

        void main() {
            vec4 color = texture2D( tDiffuse, vUv );
            vec2 uvRandom = vUv;
            uvRandom.y *= random(vec2(uvRandom.y,amount));
            color.rgb += random(uvRandom)*amount;
            gl_FragColor = vec4( color  );
        }
    `
};

export class PostProcessing {
    constructor(world) {
        this.world = world;
        this.scene = world.scene;
        this.camera = world.camera.instance;
        this.renderer = world.renderer;

        this.setupComposer();
    }

    setupComposer() {
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom for that Neon Cyan glow
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        bloomPass.strength = 1.0;
        bloomPass.radius = 0.5;
        bloomPass.threshold = 0.2; // Glows easily on dark background
        this.composer.addPass(bloomPass);

        // Noise / Film Grain
        const noisePass = new ShaderPass(NoiseShader);
        noisePass.uniforms.amount.value = 0.03; // Subtle grain
        this.composer.addPass(noisePass);
    }

    setSize(width, height) {
        this.composer.setSize(width, height);
    }

    render() {
        this.composer.render();
    }
}
