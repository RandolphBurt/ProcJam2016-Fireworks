window.onload = function () {
    var gameState = new MainState();
};
var Point = Phaser.Point;
var FireworkTransitionType;
(function (FireworkTransitionType) {
    FireworkTransitionType[FireworkTransitionType["Move"] = 0] = "Move";
    FireworkTransitionType[FireworkTransitionType["Split"] = 1] = "Split";
    FireworkTransitionType[FireworkTransitionType["Explode"] = 2] = "Explode";
})(FireworkTransitionType || (FireworkTransitionType = {}));
var FireworkTransition = (function () {
    function FireworkTransition(transitionType, angle) {
        this.transitionType = transitionType;
        this.angle = angle;
        this.angle = angle;
        this.transitionType = transitionType;
    }
    return FireworkTransition;
}());
var Firework = (function () {
    function Firework(startXPercentage, colour) {
        var _this = this;
        this.startXPercentage = startXPercentage;
        this.colour = colour;
        this.transitionList = [];
        this.spriteList = [];
        this.addTransition = function (transition) {
            _this.transitionList.push(transition);
        };
        this.runNextTransition = function () {
            var nextTransition = _this.transitionList.shift();
            switch (nextTransition.transitionType) {
                case FireworkTransitionType.Move:
                    _this.handleMove(nextTransition);
                    break;
                case FireworkTransitionType.Explode:
                    _this.handleExplosion();
                    break;
                case FireworkTransitionType.Split:
                    _this.handleSplit();
                    break;
            }
        };
        this.isFinished = function () {
            return _this.transitionList.length === 0;
        };
        this.handleMove = function (transition) {
        };
        this.handleExplosion = function () {
        };
        this.handleSplit = function () {
        };
    }
    return Firework;
}());
var Key = Phaser.Key;
var Sprite = Phaser.Sprite;
var Game = Phaser.Game;
var MainState = (function () {
    function MainState() {
        var _this = this;
        this.preload = function () {
            _this.game.load.image('firework', 'assets/firework.png');
        };
        this.init = function () {
            _this.fireworks = [];
            var numberProceduralGeneration = new NumberProceduralGeneration(324, 5, 25);
            var numbers = numberProceduralGeneration.generate(1000);
            var fireworkMapper = new NumberToFireworkMapper();
            for (var number in numbers) {
                _this.fireworks.push(fireworkMapper.map(number));
            }
        };
        this.create = function () {
            _this.game.scale.pageAlignHorizontally = true;
            _this.game.stage.backgroundColor = '#ffffff';
            _this.game.renderer.renderSession.roundPixels = true;
            _this.fireworkSpritesGroup = _this.game.add.group();
            var fireworkSprite = _this.fireworkSpritesGroup.getFirstExists(false);
            if (!fireworkSprite) {
                fireworkSprite = _this.fireworkSpritesGroup.create(400, 400, 'firework');
            }
            else {
                fireworkSprite.reset(400, 400);
            }
        };
        this.update = function () {
        };
        this.game = new Game(800, 600, Phaser.AUTO, 'content', { init: this.init, preload: this.preload, create: this.create, update: this.update });
    }
    return MainState;
}());
var NumberProceduralGeneration = (function () {
    function NumberProceduralGeneration(seed, minLength, maxLength) {
        var _this = this;
        this.seed = seed;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.generate = function (iterations) {
            var procedurallyGeneratedString = _this.procedurallyGenerateNumberString(iterations);
            var numberList = _this.splitNumberString(procedurallyGeneratedString);
            console.log(numberList.length);
            console.log(procedurallyGeneratedString.length);
            return numberList;
        };
        this.procedurallyGenerateNumberString = function (iterations) {
            var procedurallyGeneratedString = '';
            for (var i = 0; i < iterations; i++) {
                var word = _this.getNextNumberSequence().toString().replace('.', '');
                procedurallyGeneratedString = procedurallyGeneratedString + word;
            }
            return procedurallyGeneratedString;
        };
        this.getNextNumberSequence = function () {
            var x = Math.sin(_this.seed++) * 10000;
            return x - Math.floor(x);
        };
        this.splitNumberString = function (input) {
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
    }
    return NumberProceduralGeneration;
}());
var NumberToFireworkMapper = (function () {
    function NumberToFireworkMapper() {
        var _this = this;
        this.map = function (input) {
            var position = _this.translateStartPosition(input.substr(0, 2));
            var colour = _this.translateColour(input.substr(2, 1));
            var firework = new Firework(position, colour);
            _this.addTransitions(firework, input.substr(3));
            return firework;
        };
        this.addTransitions = function (firework, transitions) {
            var previousCharacter = null;
            for (var _i = 0, transitions_1 = transitions; _i < transitions_1.length; _i++) {
                var c = transitions_1[_i];
                if (previousCharacter === c) {
                    firework.addTransition(new FireworkTransition(FireworkTransitionType.Split));
                }
                else {
                    firework.addTransition(new FireworkTransition(FireworkTransitionType.Move, _this.translateAngle(c)));
                }
                previousCharacter = c;
            }
            firework.addTransition(new FireworkTransition(FireworkTransitionType.Explode));
        };
        this.translateStartPosition = function (position) {
            return parseInt(position);
        };
        this.translateColour = function (colour) {
            return NumberToFireworkMapper.colourSpectrum[parseInt(colour)];
        };
        this.translateAngle = function (value) {
            return (parseInt(value) * 90) - 45;
        };
    }
    NumberToFireworkMapper.colourSpectrum = [
        Phaser.Color.createColor(255, 165, 0),
        Phaser.Color.createColor(0, 0, 255),
        Phaser.Color.createColor(255, 0, 0),
        Phaser.Color.createColor(255, 0, 255),
        Phaser.Color.createColor(0, 255, 0),
        Phaser.Color.createColor(0, 255, 255),
        Phaser.Color.createColor(255, 255, 0),
        Phaser.Color.createColor(255, 255, 255),
        Phaser.Color.createColor(147, 112, 219),
        Phaser.Color.createColor(255, 215, 0),
    ];
    return NumberToFireworkMapper;
}());
//# sourceMappingURL=app.js.map