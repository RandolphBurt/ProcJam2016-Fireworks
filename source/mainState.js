var Key = Phaser.Key;
var Sprite = Phaser.Sprite;
var Game = Phaser.Game;
var MainState = (function () {
    function MainState() {
        var _this = this;
        this.create = function () {
            _this.game.scale.pageAlignHorizontally = true;
            _this.game.stage.backgroundColor = '#ffffff';
        };
        this.update = function () {
        };
        this.game = new Game(800, 600, Phaser.AUTO, 'content', { create: this.create, update: this.update });
    }
    return MainState;
}());
//# sourceMappingURL=mainState.js.map