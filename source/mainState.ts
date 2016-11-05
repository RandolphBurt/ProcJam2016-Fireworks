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
    private fireworkCounter:number;

    public preload = () => {
        this.game.load.image('firework', 'assets/firework.png');
    }

    public init = () => {
        this.fireworks = [];
        let numberProceduralGeneration = new NumberProceduralGeneration(324, 5, 25);
        let numbers = numberProceduralGeneration.generate(1000);

        let fireworkMapper = new NumberToFireworkMapper();
        for (var number of numbers) {
            this.fireworks.push(fireworkMapper.map(number));
        }
    }

    public create = () => {
        this.game.scale.pageAlignHorizontally = true;
        this.game.stage.backgroundColor = '#ffffff';
        this.game.renderer.renderSession.roundPixels = true;
        this.fireworkSpritesGroup = this.game.add.group();

        /* temp below
        let fireworkSprite = this.fireworkSpritesGroup.getFirstExists(false);

        if (!fireworkSprite) {
            fireworkSprite = this.fireworkSpritesGroup.create(400, 400, 'firework');
        } else {
            fireworkSprite.reset(400, 400);
        }        
        */

        this.fireworkCounter = 0;
        this.fireworkCreationTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 5, this.fireworkCreationTick, this);
        this.fireworkTransitionTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 2, this.fireworkTransitionTick, this);
    }
   
    private fireworkTransitionTick = () => {
        let elapsed = this.game.time.totalElapsedSeconds();

        for (let firework of this.fireworks) {
            if (!firework.hasStarted()) {
                // They start in order so if this one has not started then no others after this will be
                return;
            }

            if (!firework.hasFinished() && firework.getNextTransitionEventTime() <= elapsed) {
                firework.runNextTransition();
                this.setFireworkNextTransitionTime(firework);
            }
        }
    }

    private fireworkCreationTick = () => {
        if (this.fireworkCounter >= this.fireworks.length) {
            this.game.time.events.remove(this.fireworkCreationTimer);
            return;
        }

        let firework = this.fireworks[this.fireworkCounter];
        this.attachFireworkSprite(firework)
        this.setFireworkNextTransitionTime(firework);
        this.fireworkCounter++;
    }

    private setFireworkNextTransitionTime = (firework:Firework) => {
        firework.setNextTransitionEventTime(this.game.time.totalElapsedSeconds() + 1);
    }

    private attachFireworkSprite = (firework:Firework) => {
        let fireworkSprite = this.fireworkSpritesGroup.getFirstExists(false);

        let startXPosition:number = 800 * firework.startXPercentage / 100;
        if (!fireworkSprite) {
            fireworkSprite = this.fireworkSpritesGroup.create(startXPosition, 400, 'firework');
        } else {
            fireworkSprite.reset(startXPosition, 400);
        }
        // TODO: Set the speed/direction
        firework.addSprite(fireworkSprite);
   }
}