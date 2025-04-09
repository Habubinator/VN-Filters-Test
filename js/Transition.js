export default class Transition {
    constructor(ctx) {
        this.ctx = ctx;
        this.isTransitioning = false;
        this.alpha = 0;
        this.speed = 0.01;
        this.isDarkening = true;
        this.onSceneChangeCallback = null;

        // Add easing functions for smoother transitions
        this.easingFunction = this.easeInOutQuad;
        this.transitionProgress = 0;
        this.transitionDuration = 500; // in milliseconds
        this.transitionStartTime = 0;
    }

    // Smooth easing function
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    start(onSceneChange, duration = 500) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.isDarkening = true;
        this.alpha = 0;
        this.transitionProgress = 0;
        this.transitionDuration = duration;
        this.transitionStartTime = performance.now();
        this.onSceneChangeCallback = onSceneChange;
    }

    update(deltaTime = 16.67) {
        if (!this.isTransitioning) return;

        const currentTime = performance.now();
        const elapsed = currentTime - this.transitionStartTime;
        this.transitionProgress = Math.min(1.0, elapsed / this.transitionDuration);

        if (this.isDarkening) {
            // Fade to black phase
            this.alpha = this.easingFunction(this.transitionProgress);

            if (this.transitionProgress >= 1.0) {
                this.alpha = 1;
                this.isDarkening = false;
                this.transitionStartTime = currentTime; // Reset for fade-in phase
                this.transitionProgress = 0;

                if (this.onSceneChangeCallback && typeof this.onSceneChangeCallback === 'function') {
                    this.onSceneChangeCallback();
                }
            }
        } else {
            // Fade from black phase
            this.alpha = 1 - this.easingFunction(this.transitionProgress);

            if (this.transitionProgress >= 1.0) {
                this.alpha = 0;
                this.isTransitioning = false;
            }
        }

        this.applyOverlay();
    }

    applyOverlay() {
        if (this.alpha <= 0.01) return;

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();
    }
}