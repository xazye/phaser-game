import { SpriteConstructor } from "../interfaces/graphics.interface"

export class Enemy extends Phaser.GameObjects.Image  {
    private enemyMinSpeed: number
    private enemyMaxSpeed: number
    private enemyMinY: number
    private enemyMaxY: number

    private velocity: number

    constructor(params: SpriteConstructor) {
        super(params.scene, params.x, params.y, params.texture);
        this.setScale(0.6);
        this.flipX = true

        this.enemyMinSpeed = 1;
        this.enemyMaxSpeed = 4.5;
        this.enemyMinY = 80;
        this.enemyMaxY = 280;
        let dir = Math.random() < 0.5 ? 1 : -1;
        this.velocity = dir * (this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed));
        
        this.scene.add.existing(this);
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.width, this.height), Phaser.Geom.Rectangle.Contains)
    }

    update(): void {
        this.y += this.velocity

        let conditionUp = this.velocity < 0 && this.y <= this.enemyMinY;
        let conditionDown = this.velocity > 0 && this.y >= this.enemyMaxY;

        // if we passed the upper or lower limit, reverse 
        if (conditionUp || conditionDown) {
            this.velocity *= -1;
        }
    }

    
}