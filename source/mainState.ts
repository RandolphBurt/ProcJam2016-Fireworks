import Key = Phaser.Key;
import Sprite = Phaser.Sprite;
import Game = Phaser.Game;

class MainState {
    constructor() {
        this.game = new Game(800, 600, Phaser.AUTO, 'content', { create: this.create, update: this.update });
    }

    private game :Game;

    public create = () => {
        this.game.scale.pageAlignHorizontally = true;
        this.game.stage.backgroundColor = '#ffffff';
    }

    public update = () => {

    }
}