export default class GlitchEffects {
    constructor(ctx) {
        this.ctx = ctx;
    }

    applyHueGradientOverlay(time, x, y, width, height) {
        const gradient = this.ctx.createLinearGradient(0, y, 0, y + height);
        const t = Math.sin(time * 0.0005) * 0.5 + 0.5;

        const dark = '#1a001a';
        const light = '#ffe6f0';

        const color1 = this.lerpColor(dark, light, t * 0.2);
        const color2 = this.lerpColor(dark, light, 0.5 + t * 0.2);
        const color3 = this.lerpColor(dark, light, 1.0);

        gradient.addColorStop(0, color1);
        gradient.addColorStop(0.5, color2);
        gradient.addColorStop(1, color3);

        this.ctx.globalCompositeOperation = 'hue';
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.globalCompositeOperation = 'source-over';
    }

    drawSymbolOverlay(time, settings) {
        const { symbols, symbolSpacing, symbolDensity, symbolColor, symbolFont } = settings;

        this.ctx.font = symbolFont;
        this.ctx.fillStyle = symbolColor;

        for (let y = 0; y < this.ctx.canvas.height; y += symbolSpacing) {
            for (let x = 0; x < this.ctx.canvas.width; x += symbolSpacing) {
                if (Math.random() > symbolDensity) {
                    const ch = symbols[Math.floor(Math.random() * symbols.length)];
                    this.ctx.fillText(ch, x, y);
                }
            }
        }
    }

    bendImage(settings) {
        const { bendAmplitude, bendHeight, bendFrequency } = settings;

        // Skip the effect if amplitude is too small
        if (Math.abs(bendAmplitude) < 0.1) return;

        // Create temp canvas only once as a class property if it doesn't exist
        if (!this.tempCanvas) {
            this.tempCanvas = document.createElement('canvas');
            this.tempCtx = this.tempCanvas.getContext('2d', { willReadFrequently: true });
        }

        // Make sure temp canvas matches the main canvas size
        if (this.tempCanvas.width !== this.ctx.canvas.width ||
            this.tempCanvas.height !== this.ctx.canvas.height) {
            this.tempCanvas.width = this.ctx.canvas.width;
            this.tempCanvas.height = this.ctx.canvas.height;
        }

        // Draw the current canvas content to the temp canvas
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        this.tempCtx.drawImage(this.ctx.canvas, 0, 0);

        // Clear the main canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Apply bend effect with less frequent sampling
        const sliceHeight = Math.max(1, Math.floor(bendHeight));
        const now = Date.now() * 0.002;

        for (let y = 0; y < this.ctx.canvas.height; y += sliceHeight) {
            const dx = Math.sin(y * bendFrequency + now) * bendAmplitude;

            // Use drawImage for better performance instead of getImageData/putImageData
            this.ctx.drawImage(
                this.tempCanvas,
                0, y, this.ctx.canvas.width, sliceHeight,  // Source
                dx, y, this.ctx.canvas.width, sliceHeight  // Destination
            );
        }
    }

    lerpColor(colorA, colorB, amount) {
        if (!colorA.startsWith('#') || colorA.length !== 7) return colorB;
        if (!colorB.startsWith('#') || colorB.length !== 7) return colorA;

        try {
            const ar = parseInt(colorA.slice(1, 3), 16);
            const ag = parseInt(colorA.slice(3, 5), 16);
            const ab = parseInt(colorA.slice(5, 7), 16);
            const br = parseInt(colorB.slice(1, 3), 16);
            const bg = parseInt(colorB.slice(3, 5), 16);
            const bb = parseInt(colorB.slice(5, 7), 16);

            // Check if any of the values are NaN
            if (isNaN(ar) || isNaN(ag) || isNaN(ab) || isNaN(br) || isNaN(bg) || isNaN(bb)) {
                return '#000000';
            }

            const rr = Math.round(ar + (br - ar) * amount);
            const rg = Math.round(ag + (bg - ag) * amount);
            const rb = Math.round(ab + (bb - ab) * amount);

            // Ensure values are clamped to valid range
            const r = Math.min(255, Math.max(0, rr)).toString(16).padStart(2, '0');
            const g = Math.min(255, Math.max(0, rg)).toString(16).padStart(2, '0');
            const b = Math.min(255, Math.max(0, rb)).toString(16).padStart(2, '0');

            return `#${r}${g}${b}`;
        } catch (e) {
            // If there's any error in parsing, return a fallback color
            console.error("Error in lerpColor:", e);
            return '#000000';
        }
    }
}