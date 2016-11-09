import Key = Phaser.Key;
import Sprite = Phaser.Sprite;
import Game = Phaser.Game;

class MainState {
    constructor() {
        this.game = new Game(800, 600, Phaser.AUTO, 'content', { init: this.init, preload: this.preload, create: this.create });
    }

    private game :Game;
    private fireworkCreationTimer:Phaser.TimerEvent;
    private fireworkTransitionTimer:Phaser.TimerEvent;
    private fireworkSpritesGroup:Phaser.Group;
    private fireworks:Firework[];
    private fireworkLaunchedCounter:number;

    public preload = () => {
        this.game.load.image('firework', 'assets/firework.png');
    }

    public init = () => {
        this.fireworks = [];
        let numberProceduralGeneration = new NumberProceduralGeneration(324, 5, 25);
        let numbers = numberProceduralGeneration.generate(1000);

        let fireworkCallbacks: FireworkCallbacks = {
            createFireworkSprite: this.createFireworkSprite, 
            getGameTimeElapsed: this.getGameTimeElapsed
        };

        let fireworkFactory = new FireworkFactory(fireworkCallbacks);
        for (var number of numbers) {
            this.fireworks.push(fireworkFactory.create(number));
        }
    }

    public create = () => {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, 800, 600);

        this.game.scale.pageAlignHorizontally = true;
        this.game.stage.backgroundColor = '#ffffff';
        this.game.renderer.renderSession.roundPixels = true;
        this.fireworkSpritesGroup = this.game.add.physicsGroup();

        /* temp below
        let fireworkSprite = this.fireworkSpritesGroup.getFirstExists(false);

        if (!fireworkSprite) {
            fireworkSprite = this.fireworkSpritesGroup.create(400, 400, 'firework');
        } else {
            fireworkSprite.reset(400, 400);
        }        
        */

        this.fireworkLaunchedCounter = 0;
        this.fireworkCreationTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 5, this.fireworkCreationTick, this);
        this.fireworkTransitionTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 2, this.fireworkTransitionTick, this);
    }
   
    private fireworkTransitionTick = () => {
        let elapsed = this.getGameTimeElapsed();

        for (let firework of this.fireworks) {
            if (!firework.hasStarted()) {
                // They start in order so if this one has not started then no others after this will be
                return;
            }

            if (!firework.hasFinished() && firework.getNextTransitionEventTime() <= elapsed) {
                firework.runNextTransition();
            }
        }
    }

    private fireworkCreationTick = () => {
        if (this.fireworkLaunchedCounter >= this.fireworks.length) {
            this.game.time.events.remove(this.fireworkCreationTimer);
            return;
        }

        this.fireworks[this.fireworkLaunchedCounter].launch();

        this.fireworkLaunchedCounter++;
    }

    private getGameTimeElapsed = () : number => {
        return this.game.time.totalElapsedSeconds();
    }

    private createFireworkSprite = (startXPercentage:number, angle:number, speed:number) : any => {
        let fireworkSprite = this.fireworkSpritesGroup.getFirstExists(false);

        let startXPosition:number = 800 * startXPercentage / 100;
        if (!fireworkSprite) {
            fireworkSprite = this.fireworkSpritesGroup.create(startXPosition, 400, 'firework');
        } else {
            fireworkSprite.reset(startXPosition, 400);
        }
        this.game.physics.enable(fireworkSprite, Phaser.Physics.ARCADE);

        fireworkSprite.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(angle, speed));

        return fireworkSprite;
   }
}