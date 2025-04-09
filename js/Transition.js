export default class Transition {
    constructor(ctx) {
        this.ctx = ctx;
        this.isTransitioning = false;
        this.alpha = 0;
        this.speed = 0.01;
        this.isDarkening = true;
        this.onSceneChangeCallback = null;
    }

    start(onSceneChange, speed = 0.05) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.isDarkening = true;
        this.alpha = 0;
        this.speed = speed;
        this.onSceneChangeCallback = onSceneChange;
    }

    update() {
        if (!this.isTransitioning) return;

        if (this.isDarkening) {
            this.alpha += this.speed;

            if (this.alpha >= 1) {
                this.alpha = 1;
                this.isDarkening = false;

                if (this.onSceneChangeCallback && typeof this.onSceneChangeCallback === 'function') {
                    this.onSceneChangeCallback();
                }
            }
        } else {
            this.alpha -= this.speed;

            if (this.alpha <= 0) {
                this.alpha = 0;
                this.isTransitioning = false;
            }
        }

        this.applyOverlay();
    }

    applyOverlay() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();
    }
}