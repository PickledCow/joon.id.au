// Input handler
class InputMap {
    private keys = new Map(); // Live buffer for instant events
    private currentKeys = new Map(); // Current frame keys
    private prevKeys = new Map(); // Previous frame keys

    private _keyDown(e: KeyboardEvent): void {
        this.keys.set(e.code, true);
    }
    private _keyUp(e: KeyboardEvent): void {
        this.keys.set(e.code, false);
    }

    isKeyPressed(key: string): boolean {
        if (!this.currentKeys.has(key)) return false;
        return this.currentKeys.get(key);
    }

    isKeyReleased(key: string): boolean {
        if (!this.currentKeys.has(key)) return true;
        return this.currentKeys.get(key);
    }

    isKeyJustPressed(key: string): boolean {
        if (!this.currentKeys.has(key)) return false;
        return this.currentKeys.get(key) && !this.prevKeys.get(key);
    }

    isKeyJustReleased(key: string): boolean {
        if (!this.currentKeys.has(key)) return false;
        return !this.currentKeys.get(key) && this.prevKeys.get(key);
    }
    // Cycle over 
    updateKeys() {
        // console.log(this.currentKeys);
        for (const key of this.currentKeys) {
            this.prevKeys.set(key[0], key[1]);
        }
        for (const key of this.keys) {
            this.currentKeys.set(key[0], key[1]);
        }
    }

    cleanUp() {
        window.removeEventListener("keydown", this._keyDown);
        window.removeEventListener("keyup", this._keyUp);
    }
 
    constructor() {
        window.addEventListener("keydown", this._keyDown.bind(this));
        window.addEventListener("keyup", this._keyUp.bind(this));
    }

}

export { InputMap }