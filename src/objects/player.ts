import { SpriteConstructor } from "../interfaces/graphics.interface"
export class Player extends Phaser.GameObjects.Image {
    private velocity: number   
    private mouseInput: Phaser.Input.Pointer

    constructor(params:SpriteConstructor){
        super(params.scene, params.x, params.y, params.texture)
        this.velocity = 2
        this.setScale(0.6)

        this.scene.add.existing(this);
        this.mouseInput = this.scene.input.activePointer

        // #for debug
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.width, this.height), Phaser.Geom.Rectangle.Contains)
    }

    update(): void {
        if (this.mouseInput.isDown) {
            this.handleInput()
        }
    }
    
    handleInput(){
        this.x += this.velocity;
    }
}