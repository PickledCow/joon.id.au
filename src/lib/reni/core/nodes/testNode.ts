import { Node } from "./node"
import { Main } from '../main'
import { vec2, mat2, mat3 } from 'gl-matrix'

class TestNode extends Node {

    onDraw(delta: number): void {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(-99.9, -99.9, 199.9, 199.9);
        this.ctx.fillStyle = "magenta";
        this.ctx.fillRect(-100, -100, 100, 100);
        this.ctx.fillRect(0, 0, 100, 100);
    }

    onTick(delta: number): void {
        this.rotation += delta

        if (this.inputMap.isKeyJustPressed('KeyW')) {
            console.log('W was pressed!');
        }
        
    }

    constructor(main: Main) {super(main!)}
}

export { TestNode }

