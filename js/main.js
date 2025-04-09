import GlitchEngine from './GlitchEngine.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const engine = new GlitchEngine(canvas);

    setupScenes(engine);
    setupControls(engine);

    engine.preloadImages();
    engine.start();
});

function setupScenes(engine) {
    const sceneManager = engine.sceneManager;

    sceneManager.list[0] = {
        imageSrc: 'images/photo3.jpg',
        text: "Тестовый текст",
        textPosition: "left",
        glitchSettings: { ...engine.defaultGlitchSettings }
    };

    sceneManager.addScene({
        imageSrc: 'images/photo2.jpg',
        text: "Second scene text",
        textPosition: "right",
        glitchSettings: {
            ...engine.defaultGlitchSettings,
            rgbShift: 2,
            bendAmplitude: 0.5,
            // Reduce density for better performance
            symbolDensity: 0.7
        }
    });

    sceneManager.addScene({
        imageSrc: 'images/photo1.jpg',
        text: "Final scene",
        textPosition: "right",
        glitchSettings: {
            ...engine.defaultGlitchSettings,
            hueShiftSpeed: 0.2,
            // Reduce these values for better performance
            bendFrequency: 0.5,
            symbolDensity: 0.7,
            symbolColor: 'rgba(255, 0, 0, 0.2)'
        }
    });
}

function setupControls(engine) {
    // Track last key press time to prevent rapid switching
    let lastKeyPressTime = 0;
    const keyDebounceTime = 300; // ms

    document.addEventListener('keydown', (e) => {
        const now = Date.now();

        // Skip if key was pressed too recently
        if (now - lastKeyPressTime < keyDebounceTime) {
            return;
        }

        lastKeyPressTime = now;

        switch (e.key) {
            case 'ArrowRight':
                engine.goToNextScene();
                break;
            case 'ArrowLeft':
                engine.goToPreviousScene();
                break;
            case ' ':
                engine.togglePause();
                break;
        }
    });

    // Simple debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            engine.handleResize();
        }, 250);
    });
}