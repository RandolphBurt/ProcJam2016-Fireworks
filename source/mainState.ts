import Key = Phaser.Key;
import Sprite = Phaser.Sprite;
import Game = Phaser.Game;

class MainState {
    constructor() {
        this.game = new Game(800, 600, Phaser.AUTO, 'content', { init: this.init, preload: this.preload, create: this.create, update: this.update });
    }

    private game :Game;
    private fireworks:Firework[];
    private fireworkSpritesGroup:Phaser.Group;

    public preload = () => {
        this.game.load.image('firework', 'assets/firework.png');
    }

    public init = () => {
        this.fireworks = [];
        let numberProceduralGeneration = new NumberProceduralGeneration(324, 5, 25);
        let numbers = numberProceduralGeneration.generate(1000);

        let fireworkMapper = new NumberToFireworkMapper();
        for (var number in numbers) {
            this.fireworks.push(fireworkMapper.map(number));
        }
    }

    public create = () => {
        this.game.scale.pageAlignHorizontally = true;
        this.game.stage.backgroundColor = '#ffffff';
        this.game.renderer.renderSession.roundPixels = true;
        this.fireworkSpritesGroup = this.game.add.group();

        // temp code
        var fireworkSprite = this.fireworkSpritesGroup.getFirstExists(false);

        if (!fireworkSprite) {
            fireworkSprite = this.fireworkSpritesGroup.create(400, 400, 'firework');
        } else {
            fireworkSprite.reset(400, 400);
        }        
    }

    public update = () => {

    }
}