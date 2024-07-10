import 'phaser'
import { Player } from '../objects/player'
import { Enemy } from '../objects/enemy'

type passedByScene ={
    deathCount :number,
    winCount : number
}

export class GameScene extends Phaser.Scene {
    private player!: Player
    // private enemy!: Enemy
    private goal!: Phaser.GameObjects.Sprite
    private isItOver!: boolean
    private deathCount!: number
    private winCount!: number

    private enemies!: Phaser.GameObjects.Group
    private bg! : Phaser.GameObjects.Image
    constructor() {
        super('GameScene')
    }
    preload(): void {
        this.load.image('background', 'assets/background.png')
        this.load.image('player', 'assets/player.png')
        this.load.image('dragon', 'assets/dragon.png')
        this.load.image('chest', 'assets/treasure.png')
    }
    init(data : passedByScene) {
        this.isItOver = false
        this.deathCount = data.deathCount ?? 0
        this.winCount = data.winCount ?? 0
    }

    create(): void {
        this.bg = this.add.sprite(0, 0, 'background')
        this.bg.setOrigin(0, 0)

        // should probably be in global CONST variable
        const gameConfigW:number = typeof this.sys.game.config.width == 'number'?  this.sys.game.config.width : 0
        const gameConfigH:number = typeof this.sys.game.config.height === 'number'?  this.sys.game.config.height : parseInt(this.sys.game.config.height)
        const fontConfig = {
            fontSize: '24px'
        }

        // can do this bettter, but it's good for now
        this.add.text( 8 , gameConfigH - 30 - this.deathCount ,'Death count: ' + String(this.deathCount),{...fontConfig,fontSize: 24 + this.deathCount + 'px'})
        this.add.text( gameConfigW - 180 , gameConfigH - 30 ,'Win count: ' + String(this.winCount),{...fontConfig})

        this.player = new Player({
            scene: this,
            x: 50,
            y: gameConfigH / 2,
            texture: 'player'
        })
        // for debugging
        this.input.enableDebug(this.player)
        // for debugging

        // should probably be own class 
        this.goal = this.add.sprite(gameConfigW - 80, gameConfigH / 2, 'chest')
        this.goal.setScale(0.6)

        let enemiesArray = Array(5).fill(0).map((__, index, ___) => {
            let enemy = new Enemy({
                scene: this,
                x: 110 + (index * 105),
                y: 100 + Math.random() * 100,
                texture: 'dragon'
            })
            // for debugging
            this.input.enableDebug(enemy)
            // for debugging
            return enemy
        })
        this.enemies = this.add.group(enemiesArray)

    }

    update(): void {
        this.player.update()
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.goal.getBounds())) {
            this.isItOver ? null : this.winGame()
            return
        }
        this.enemies.getChildren().map((enemy) => {
            enemy.update()
            // i don't know where to put it ???
            // should Player decide if it colided
            // or should Enemy decide if it colided ????
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), (enemy as Enemy).getBounds())) {
                this.isItOver ? null : this.gameOver()
                return
            }
        })
    }
    // 
    winGame(){
        this.isItOver = true
        this.cameras.main.fade(500)
        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.winCount++;
            this.scene.start(this,{
                deathCount: this.deathCount,
                winCount: this.winCount
            })
        }, this)
    }
    gameOver() {
        this.isItOver = true
        this.cameras.main.shake(500)
        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => {
            this.cameras.main.fade(500)

        }, this)
        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.deathCount++;
            this.scene.start(this,{
                deathCount: this.deathCount,
                winCount: this.winCount
            })
        }, this)
    }
}