import Key = Phaser.Key;
import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Emitter = Phaser.Particles.Arcade.Emitter;

class MainState {
    constructor() {
        this.game = new Game(WorldConstants.WorldWidth, WorldConstants.WorldHeight, Phaser.AUTO, 'content', { init: this.init, preload: this.preload, create: this.create });
    }

    private game :Game;
    private fireworkCreationTimer:Phaser.TimerEvent;
    private fireworkTransitionTimer:Phaser.TimerEvent;
    private fireworkSpritesGroup:Phaser.Group;
    private fireworks:Firework[];
    private fireworkLaunchedCounter:number;

    public preload = () => {
        this.game.load.image('firework', 'assets/firework.png');
        this.game.load.image('particle', 'assets/particle.png');
    }

    public init = () => {
        this.fireworks = [];
        let numberProceduralGeneration = new NumberProceduralGeneration(324, WorldConstants.MinLengthNumberGeneration, WorldConstants.MaxLengthNumberGeneration);
        let numbers = numberProceduralGeneration.generate(1000);

        let fireworkCallbacks: FireworkCallbacks = {
            createFireworkSprite: this.createFireworkSprite, 
            getGameTimeElapsed: this.getGameTimeElapsed,
            createParticleEmitter: this.createParticleEmitter,
        };

        let fireworkFactory = new FireworkFactory(fireworkCallbacks);
        for (var number of numbers) {
            this.fireworks.push(fireworkFactory.create(number));
        }
    }

    public create = () => {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, WorldConstants.WorldWidth, WorldConstants.WorldHeight);

        this.game.scale.pageAlignHorizontally = true;
        this.game.stage.backgroundColor = '#ffffff';
        this.game.renderer.renderSession.roundPixels = true;
        this.fireworkSpritesGroup = this.game.add.physicsGroup();

        this.fireworkLaunchedCounter = 0;
        this.fireworkCreationTimer = this.game.time.events.loop(WorldConstants.FireworkCreationTick, this.fireworkCreationTick, this);
        this.fireworkTransitionTimer = this.game.time.events.loop(WorldConstants.FireworkTransitionTick, this.fireworkTransitionTick, this);
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

        let startXPosition:number = WorldConstants.WorldWidth * startXPercentage / 100;
        if (!fireworkSprite) {
            fireworkSprite = this.fireworkSpritesGroup.create(startXPosition, WorldConstants.GroundLevel, 'firework');
        } else {
            fireworkSprite.reset(startXPosition, WorldConstants.GroundLevel);
        }
        this.game.physics.enable(fireworkSprite, Phaser.Physics.ARCADE);

        fireworkSprite.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(angle, speed));

        return fireworkSprite;
   }

   private createParticleEmitter = () : Emitter => {
        let particleEmitter = this.game.add.emitter(0, 0, WorldConstants.ExplosionParticleCount);
        particleEmitter.makeParticles('particle');

        particleEmitter.gravity = WorldConstants.Gravity;

        return particleEmitter;       
   }

   private colourParticles = (particle:any) => {

   }
}