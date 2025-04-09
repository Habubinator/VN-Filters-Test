import SceneManager from './SceneManager.js';
import Transition from './Transition.js';
import GlitchEffects from './GlitchEffects.js';
import TextRenderer from './TextRenderer.js';

export default class GlitchEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isRunning = false;
        this.isPaused = false;

        this.defaultGlitchSettings = {
            rgbShift: 0,
            hueShiftSpeed: 0.1,
            bendAmplitude: 2,
            bendHeight: 1,
            bendFrequency: 0.5,
            symbols: '░▒▓█☰☷',
            symbolSpacing: 8,
            symbolDensity: 0.3,
            symbolColor: 'rgba(0, 0, 0, 0.15)',
            symbolFont: '16px monospace',
            pixelSize: 10
        };

        this.sceneManager = new SceneManager();
        this.transition = new Transition(this.ctx);
        this.glitchEffects = new GlitchEffects(this.ctx);
        this.textRenderer = new TextRenderer(this.ctx);

        this.resizeCanvas();
        this.setupImageLoader();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.calculateDimensions();
    }

    calculateDimensions() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        const targetAspect = 4 / 3;
        this.targetWidth = w;
        this.targetHeight = w / targetAspect;

        if (this.targetHeight > h) {
            this.targetHeight = h;
            this.targetWidth = h * targetAspect;
        }

        this.offsetX = (w - this.targetWidth) / 2;
        this.offsetY = (h - this.targetHeight) / 2;
    }

    setupImageLoader() {
        this.sprites = [new Image()];
        this.sprites[0].src = 'images/photo3.jpg';

        this.sprites[0].onload = () => {
            this.sceneManager.applySceneSettings(this.sceneManager.getCurrent());
            this.isRunning = true;
            this.animationLoop();
        };
    }

    start() {
        if (!this.isRunning) {
            this.setupImageLoader();
        }
    }

    stop() {
        this.isRunning = false;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    animationLoop(timestamp) {
        if (!this.isRunning) return;

        if (!this.isPaused) {
            this.render(timestamp);
        }

        requestAnimationFrame(this.animationLoop.bind(this));
    }

    render(timestamp) {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.clearRect(0, 0, w, h);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(this.offsetX, this.offsetY, this.targetWidth, this.targetHeight);
        this.ctx.clip();

        this.renderScene(timestamp || 0);

        this.ctx.restore();

        this.textRenderer.renderText(
            this.sceneManager.currentText,
            this.sceneManager.currentTextPosition,
            this.canvas.width,
            this.canvas.height
        );

        this.transition.update();
    }

    renderScene(timestamp) {
        this.ctx.filter = 'none';
        this.ctx.drawImage(this.sprites[0], this.offsetX, this.offsetY, this.targetWidth, this.targetHeight);

        const currentScene = this.sceneManager.getCurrent();
        const settings = currentScene.glitchSettings;

        this.glitchEffects.applyHueGradientOverlay(
            timestamp,
            this.offsetX,
            this.offsetY,
            this.targetWidth,
            this.targetHeight
        );

        this.glitchEffects.drawSymbolOverlay(timestamp, settings);
        this.glitchEffects.bendImage(settings);
    }

    handleResize() {
        this.resizeCanvas();
    }

    goToNextScene() {
        this.transition.start(() => {
            const nextSceneData = this.sceneManager.next();
            if (nextSceneData) {
                this.sceneManager.applySceneSettings(nextSceneData);
                this.sprites[0].src = nextSceneData.imageSrc;
            }
        });
    }

    goToPreviousScene() {
        this.transition.start(() => {
            const prevSceneData = this.sceneManager.previous();
            if (prevSceneData) {
                this.sceneManager.applySceneSettings(prevSceneData);
                this.sprites[0].src = prevSceneData.imageSrc;
            }
        });
    }

    preloadImages() {
        // Simple image cache
        this.imageCache = {};

        // Get all unique image sources
        const imageSources = this.sceneManager.list
            .map(scene => scene.imageSrc)
            .filter(src => src); // Filter out undefined

        // Remove duplicates
        const uniqueSources = [...new Set(imageSources)];

        console.log("Preloading images:", uniqueSources);

        // Load all images
        uniqueSources.forEach(src => {
            if (!this.imageCache[src]) {
                const img = new Image();
                img.src = src;
                this.imageCache[src] = img;

                // Add logging to track loading
                img.onload = () => console.log(`Loaded image: ${src}`);
                img.onerror = () => console.error(`Failed to load image: ${src}`);
            }
        });
    }

    goToScene(index) {
        this.transition.start(() => {
            const sceneData = this.sceneManager.changeTo(index);
            if (sceneData) {
                this.sceneManager.applySceneSettings(sceneData);
                this.sprites[0].src = sceneData.imageSrc;
            }
        });
    }
}