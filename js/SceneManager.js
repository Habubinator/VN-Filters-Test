export default class SceneManager {
    constructor() {
        this.current = 0;
        this.list = [{}];
        this.currentText = "";
        this.currentTextPosition = "left";
    }

    addScene(sceneData) {
        this.list.push(sceneData);
        return this.list.length - 1;
    }

    getCurrent() {
        return this.list[this.current];
    }

    changeTo(index) {
        if (index >= 0 && index < this.list.length) {
            this.current = index;
            return this.getCurrent();
        }
        return null;
    }

    next() {
        return this.changeTo((this.current + 1) % this.list.length);
    }

    previous() {
        return this.changeTo((this.current - 1 + this.list.length) % this.list.length);
    }

    applySceneSettings(sceneData) {
        if (!sceneData) return;

        this.currentText = sceneData.text || "";
        this.currentTextPosition = sceneData.textPosition || "left";
    }
}