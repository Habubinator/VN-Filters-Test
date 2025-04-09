export default class TextRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.textColor = 'white';
        this.textFont = '24px monospace';
        this.padding = 50;
    }

    renderText(text, position, canvasWidth, canvasHeight) {
        if (!text) return;

        this.ctx.font = this.textFont;
        this.ctx.fillStyle = this.textColor;

        switch (position) {
            case "left":
                this.ctx.fillText(text, this.padding, canvasHeight / 2);
                break;

            case "right":
                const textWidth = this.ctx.measureText(text).width;
                this.ctx.fillText(text, canvasWidth - this.padding - textWidth, canvasHeight / 2);
                break;

            case "center":
                const centerTextWidth = this.ctx.measureText(text).width;
                this.ctx.fillText(text, (canvasWidth - centerTextWidth) / 2, canvasHeight / 2);
                break;

            case "none":
                // Don't render text
                break;
        }
    }
}