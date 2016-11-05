window.onload = function () {
    var gameState = new MainState();
};
var Firework = (function () {
    function Firework() {
    }
    return Firework;
}());
var Key = Phaser.Key;
var Sprite = Phaser.Sprite;
var Game = Phaser.Game;
var MainState = (function () {
    function MainState() {
        var _this = this;
        this.create = function () {
            _this.game.scale.pageAlignHorizontally = true;
            _this.game.stage.backgroundColor = '#ffffff';
            var x = new NumberProceduralGeneration(324, 5, 25);
            x.Generate(1000);
        };
        this.update = function () {
        };
        this.game = new Game(800, 600, Phaser.AUTO, 'content', { create: this.create, update: this.update });
    }
    return MainState;
}());
var NumberProceduralGeneration = (function () {
    function NumberProceduralGeneration(seed, minLength, maxLength) {
        var _this = this;
        this.Generate = function (iterations) {
            var procedurallyGeneratedString = _this.ProcedurallyGenerateNumberString(iterations);
            var numberList = _this.SplitNumberString(procedurallyGeneratedString);
            console.log(numberList.length);
            console.log(procedurallyGeneratedString.length);
            return numberList;
        };
        this.ProcedurallyGenerateNumberString = function (iterations) {
            var procedurallyGeneratedString = '';
            for (var i = 0; i < iterations; i++) {
                var word = _this.GetNextNumberSequence().toString().replace('.', '');
                procedurallyGeneratedString = procedurallyGeneratedString + word;
            }
            return procedurallyGeneratedString;
        };
        this.GetNextNumberSequence = function () {
            var x = Math.sin(_this.seed++) * 10000;
            return x - Math.floor(x);
        };
        this.SplitNumberString = function (input) {
            var numberList = [];
            var count = 0;
            var resultLength = input.length;
            while (count < resultLength) {
                var splitLength = (parseInt(input.substr(count, 2)) % (_this.maxLength - _this.minLength)) + _this.minLength;
                if (splitLength == 0) {
                    splitLength = 1;
                }
                var word = input.substr(count + 2, splitLength);
                numberList.push(word);
                console.log(word);
                count = count + splitLength + 2;
            }
            return numberList;
        };
        this.seed = seed;
        this.minLength = minLength;
        this.maxLength = maxLength;
    }
    return NumberProceduralGeneration;
}());
var NumberToFireworkMapper = (function () {
    function NumberToFireworkMapper() {
        this.Map = function (input) {
            return new Firework();
        };
    }
    return NumberToFireworkMapper;
}());
//# sourceMappingURL=app.js.map