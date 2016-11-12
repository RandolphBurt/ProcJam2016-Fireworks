import Key = Phaser.Key;
import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Emitter = Phaser.Particles.Arcade.Emitter;

class MainState {
    constructor() {
        this.game = new Game(WorldConstants.WorldWidth, WorldConstants.WorldHeight, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }

    private game :Game;
    private fireworkCreationTimer:Phaser.TimerEvent;
    private fireworkTransitionTimer:Phaser.TimerEvent;
    private fireworkSpritesGroup:Phaser.Group;
    private fireworks:Firework[];
    private fireworkLaunchedCounter:number;
    private gameClock:GameClock;

    public preload = () => {
        this.game.load.image('firework', 'assets/firework.png');
        this.game.load.image('particle', 'assets/particle.png');
    }

    public create = () => {
        this.initialiseGame();
        this.generateFireworks();
        this.startGame();
    }

    private initialiseGame = () => {
        this.gameClock = new GameClock(this.game);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, WorldConstants.WorldWidth, WorldConstants.WorldHeight);

        this.game.scale.pageAlignHorizontally = true;
        this.game.stage.backgroundColor = '#222222';
        this.game.renderer.renderSession.roundPixels = true;
        this.fireworkSpritesGroup = this.game.add.physicsGroup();
    }

    private generateFireworks = () => {
        this.fireworks = [];
        let fireworkFactory = new FireworkFactory(
            new FireworkSpriteHandler(this.game, this.fireworkSpritesGroup), 
            new FireworkParticleHandler(this.game), 
            this.gameClock);

        let numberProceduralGeneration = new NumberProceduralGeneration(324, WorldConstants.MinLengthNumberGeneration, WorldConstants.MaxLengthNumberGeneration);
        let numbers = numberProceduralGeneration.generate(1000);

        for (var number of numbers) {
            this.fireworks.push(fireworkFactory.create(number));
        }
    }

    private startGame = () => {
        this.fireworkLaunchedCounter = 0;
        this.fireworkCreationTimer = this.game.time.events.loop(WorldConstants.FireworkCreationTick, this.fireworkCreationTick, this);
        this.fireworkTransitionTimer = this.game.time.events.loop(WorldConstants.FireworkTransitionTick, this.fireworkTransitionTick, this);
    }
   
    private fireworkTransitionTick = () => {
        let elapsed = this.gameClock.getGameTimeElapsed();

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
}