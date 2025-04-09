import GlitchEngine from './GlitchEngine.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const engine = new GlitchEngine(canvas);

    setupScenes(engine);
    setupControls(engine);

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
            symbolDensity: 0.93
        }
    });

    sceneManager.addScene({
        imageSrc: 'images/photo1.jpg',
        text: "Final scene",
        textPosition: "right",
        glitchSettings: {
            ...engine.defaultGlitchSettings,
            hueShiftSpeed: 0.2,
            bendFrequency: 0.93,
            symbolDensity: 0.93,
            symbolColor: 'rgba(255, 0, 0, 0.2)'
        }
    });
}

function setupControls(engine) {
    document.addEventListener('keydown', (e) => {
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

    window.addEventListener('resize', () => {
        engine.handleResize();
    });
}