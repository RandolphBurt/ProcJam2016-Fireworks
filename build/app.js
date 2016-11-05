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
var FireworkState;
(function (FireworkState) {
    FireworkState[FireworkState["InActive"] = 0] = "InActive";
    FireworkState[FireworkState["Active"] = 1] = "Active";
    FireworkState[FireworkState["Finished"] = 2] = "Finished";
})(FireworkState || (FireworkState = {}));
var FireworkTransition = (function () {
    function FireworkTransition(transitionType, angle, color) {
        this.transitionType = transitionType;
        this.angle = angle;
        this.color = color;
    }
    return FireworkTransition;
}());
var Firework = (function () {
    function Firework(startXPercentage) {
        var _this = this;
        this.startXPercentage = startXPercentage;
        this.transitionList = [];
        this.spriteList = [];
        this.state = FireworkState.InActive;
        this.nextTransitionEventTime = 0;
        this.addTransition = function (transition) {
            _this.transitionList.push(transition);
        };
        this.addSprite = function (sprite) {
            _this.spriteList.push(sprite);
        };
        this.runNextTransition = function () {
            var nextTransition = _this.transitionList.shift();
            switch (nextTransition.transitionType) {
                case FireworkTransitionType.Move:
                    _this.handleMove(nextTransition);
                    break;
                case FireworkTransitionType.Explode:
                    _this.handleExplosion(nextTransition);
                    break;
                case FireworkTransitionType.Split:
                    _this.handleSplit(nextTransition);
                    break;
            }
            if (_this.transitionList.length === 0) {
                _this.state = FireworkState.Finished;
            }
        };
        this.setNextTransitionEventTime = function (nextTransitionEvent) {
            if (_this.state === FireworkState.InActive) {
                _this.state = FireworkState.Active;
            }
            _this.nextTransitionEventTime = nextTransitionEvent;
        };
        this.getNextTransitionEventTime = function () {
            return _this.nextTransitionEventTime;
        };
        this.hasStarted = function () {
            return _this.state !== FireworkState.InActive;
        };
        this.hasFinished = function () {
            return _this.state === FireworkState.Finished;
        };
        this.handleMove = function (transition) {
        };
        this.handleExplosion = function (transition) {
        };
        this.handleSplit = function (transition) {
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
            for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
                var number = numbers_1[_i];
                _this.fireworks.push(fireworkMapper.map(number));
            }
        };
        this.create = function () {
            _this.game.scale.pageAlignHorizontally = true;
            _this.game.stage.backgroundColor = '#ffffff';
            _this.game.renderer.renderSession.roundPixels = true;
            _this.fireworkSpritesGroup = _this.game.add.group();
            _this.fireworkCounter = 0;
            _this.fireworkCreationTimer = _this.game.time.events.loop(Phaser.Timer.SECOND / 5, _this.fireworkCreationTick, _this);
            _this.fireworkTransitionTimer = _this.game.time.events.loop(Phaser.Timer.SECOND / 2, _this.fireworkTransitionTick, _this);
        };
        this.fireworkTransitionTick = function () {
            var elapsed = _this.game.time.totalElapsedSeconds();
            for (var _i = 0, _a = _this.fireworks; _i < _a.length; _i++) {
                var firework = _a[_i];
                if (!firework.hasStarted()) {
                    return;
                }
                if (!firework.hasFinished() && firework.getNextTransitionEventTime() <= elapsed) {
                    firework.runNextTransition();
                    _this.setFireworkNextTransitionTime(firework);
                }
            }
        };
        this.fireworkCreationTick = function () {
            if (_this.fireworkCounter >= _this.fireworks.length) {
                _this.game.time.events.remove(_this.fireworkCreationTimer);
                return;
            }
            var firework = _this.fireworks[_this.fireworkCounter];
            _this.attachFireworkSprite(firework);
            _this.setFireworkNextTransitionTime(firework);
            _this.fireworkCounter++;
        };
        this.setFireworkNextTransitionTime = function (firework) {
            firework.setNextTransitionEventTime(_this.game.time.totalElapsedSeconds() + 1);
        };
        this.attachFireworkSprite = function (firework) {
            var fireworkSprite = _this.fireworkSpritesGroup.getFirstExists(false);
            var startXPosition = 800 * firework.startXPercentage / 100;
            if (!fireworkSprite) {
                fireworkSprite = _this.fireworkSpritesGroup.create(startXPosition, 400, 'firework');
            }
            else {
                fireworkSprite.reset(startXPosition, 400);
            }
            firework.addSprite(fireworkSprite);
        };
        this.game = new Game(800, 600, Phaser.AUTO, 'content', { init: this.init, preload: this.preload, create: this.create });
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
            var position = input.substr(0, 2);
            var movementTransitions = input.substr(2, input.length - 3);
            var colour = input[input.length - 1];
            var firework = new Firework(_this.translateStartPosition(position));
            _this.addMovementTransitions(firework, movementTransitions);
            _this.addExplosionTransition(firework, colour);
            return firework;
        };
        this.addExplosionTransition = function (firework, transition) {
            firework.addTransition(new FireworkTransition(FireworkTransitionType.Explode, _this.translateColour(transition)));
        };
        this.addMovementTransitions = function (firework, transitions) {
            var previousCharacter = null;
            for (var _i = 0, transitions_1 = transitions; _i < transitions_1.length; _i++) {
                var c = transitions_1[_i];
                if (previousCharacter === c) {
                    firework.addTransition(new FireworkTransition(FireworkTransitionType.Split, _this.translateColour(c)));
                }
                else {
                    firework.addTransition(new FireworkTransition(FireworkTransitionType.Move, _this.translateAngle(c)));
                }
                previousCharacter = c;
            }
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