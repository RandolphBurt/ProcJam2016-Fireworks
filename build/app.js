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
    function Firework(startXPercentage, fireworkCallbacks) {
        var _this = this;
        this.startXPercentage = startXPercentage;
        this.fireworkCallbacks = fireworkCallbacks;
        this.transitionList = [];
        this.spriteList = [];
        this.particleEmitterList = [];
        this.state = FireworkState.InActive;
        this.nextTransitionEventTime = 0;
        this.launch = function () {
            var sprite = _this.fireworkCallbacks.createFireworkSprite(_this.startXPercentage, -90, 50);
            _this.spriteList.push(sprite);
            var particleEmitter = _this.fireworkCallbacks.createParticleEmitter();
            _this.particleEmitterList.push(particleEmitter);
            _this.setNextTransitionEventTime();
        };
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
                    _this.handleExplosion(nextTransition);
                    break;
                case FireworkTransitionType.Split:
                    _this.handleSplit(nextTransition);
                    break;
            }
            if (_this.transitionList.length === 0) {
                _this.state = FireworkState.Finished;
            }
            else {
                _this.setNextTransitionEventTime();
            }
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
        this.setNextTransitionEventTime = function () {
            if (_this.state === FireworkState.InActive) {
                _this.state = FireworkState.Active;
            }
            _this.nextTransitionEventTime = _this.fireworkCallbacks.getGameTimeElapsed() + 1;
        };
        this.handleMove = function (transition) {
        };
        this.handleExplosion = function (transition) {
            _this.explodeSprites(transition.color);
            for (var _i = 0, _a = _this.spriteList; _i < _a.length; _i++) {
                var sprite = _a[_i];
                sprite.destroy();
            }
        };
        this.handleSplit = function (transition) {
            _this.explodeSprites(transition.color);
        };
        this.explodeSprites = function (color) {
            for (var i = 0; i < _this.spriteList.length; i++) {
                var particleEmitter = _this.particleEmitterList[i];
                var sprite = _this.spriteList[i];
                particleEmitter.x = sprite.x;
                particleEmitter.y = sprite.y;
                particleEmitter.forEach(function (particle) { particle.tint = color; }, _this);
                particleEmitter.start(true, WorldConstants.ParticleLifespanMilliseconds, null, WorldConstants.ExplosionParticleCount);
            }
        };
    }
    return Firework;
}());
var FireworkFactory = (function () {
    function FireworkFactory(fireworkCallbacks) {
        var _this = this;
        this.fireworkCallbacks = fireworkCallbacks;
        this.create = function (input) {
            var position = input.substr(0, 2);
            var movementTransitions = input.substr(2, input.length - 3);
            var colour = input[input.length - 1];
            var firework = new Firework(_this.translateStartPosition(position), _this.fireworkCallbacks);
            _this.addMovementTransitions(firework, movementTransitions);
            _this.addExplosionTransition(firework, colour);
            return firework;
        };
        this.addExplosionTransition = function (firework, transition) {
            firework.addTransition(new FireworkTransition(FireworkTransitionType.Explode, null, _this.translateColour(transition)));
        };
        this.addMovementTransitions = function (firework, transitions) {
            var previousCharacter = null;
            for (var _i = 0, transitions_1 = transitions; _i < transitions_1.length; _i++) {
                var c = transitions_1[_i];
                if (previousCharacter === c) {
                    firework.addTransition(new FireworkTransition(FireworkTransitionType.Split, null, _this.translateColour(c)));
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
            return FireworkFactory.colourSpectrum[parseInt(colour)];
        };
        this.translateAngle = function (value) {
            return (parseInt(value) * 90) - 45;
        };
    }
    FireworkFactory.colourSpectrum = [
        0xFFA500,
        0x0000FF,
        0xFF0000,
        0xFF00FF,
        0x00FF00,
        0x00FFFF,
        0xFFFF00,
        0xFFFFFF,
        0x9370DB,
        0xFFD700,
    ];
    return FireworkFactory;
}());
var Key = Phaser.Key;
var Sprite = Phaser.Sprite;
var Game = Phaser.Game;
var Emitter = Phaser.Particles.Arcade.Emitter;
var MainState = (function () {
    function MainState() {
        var _this = this;
        this.preload = function () {
            _this.game.load.image('firework', 'assets/firework.png');
            _this.game.load.image('particle', 'assets/particle.png');
        };
        this.init = function () {
            _this.fireworks = [];
            var numberProceduralGeneration = new NumberProceduralGeneration(324, WorldConstants.MinLengthNumberGeneration, WorldConstants.MaxLengthNumberGeneration);
            var numbers = numberProceduralGeneration.generate(1000);
            var fireworkCallbacks = {
                createFireworkSprite: _this.createFireworkSprite,
                getGameTimeElapsed: _this.getGameTimeElapsed,
                createParticleEmitter: _this.createParticleEmitter,
            };
            var fireworkFactory = new FireworkFactory(fireworkCallbacks);
            for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
                var number = numbers_1[_i];
                _this.fireworks.push(fireworkFactory.create(number));
            }
        };
        this.create = function () {
            _this.game.physics.startSystem(Phaser.Physics.ARCADE);
            _this.game.world.setBounds(0, 0, WorldConstants.WorldWidth, WorldConstants.WorldHeight);
            _this.game.scale.pageAlignHorizontally = true;
            _this.game.stage.backgroundColor = '#ffffff';
            _this.game.renderer.renderSession.roundPixels = true;
            _this.fireworkSpritesGroup = _this.game.add.physicsGroup();
            _this.fireworkLaunchedCounter = 0;
            _this.fireworkCreationTimer = _this.game.time.events.loop(WorldConstants.FireworkCreationTick, _this.fireworkCreationTick, _this);
            _this.fireworkTransitionTimer = _this.game.time.events.loop(WorldConstants.FireworkTransitionTick, _this.fireworkTransitionTick, _this);
        };
        this.fireworkTransitionTick = function () {
            var elapsed = _this.getGameTimeElapsed();
            for (var _i = 0, _a = _this.fireworks; _i < _a.length; _i++) {
                var firework = _a[_i];
                if (!firework.hasStarted()) {
                    return;
                }
                if (!firework.hasFinished() && firework.getNextTransitionEventTime() <= elapsed) {
                    firework.runNextTransition();
                }
            }
        };
        this.fireworkCreationTick = function () {
            if (_this.fireworkLaunchedCounter >= _this.fireworks.length) {
                _this.game.time.events.remove(_this.fireworkCreationTimer);
                return;
            }
            _this.fireworks[_this.fireworkLaunchedCounter].launch();
            _this.fireworkLaunchedCounter++;
        };
        this.getGameTimeElapsed = function () {
            return _this.game.time.totalElapsedSeconds();
        };
        this.createFireworkSprite = function (startXPercentage, angle, speed) {
            var fireworkSprite = _this.fireworkSpritesGroup.getFirstExists(false);
            var startXPosition = WorldConstants.WorldWidth * startXPercentage / 100;
            if (!fireworkSprite) {
                fireworkSprite = _this.fireworkSpritesGroup.create(startXPosition, WorldConstants.GroundLevel, 'firework');
            }
            else {
                fireworkSprite.reset(startXPosition, WorldConstants.GroundLevel);
            }
            _this.game.physics.enable(fireworkSprite, Phaser.Physics.ARCADE);
            fireworkSprite.body.velocity.copyFrom(_this.game.physics.arcade.velocityFromAngle(angle, speed));
            return fireworkSprite;
        };
        this.createParticleEmitter = function () {
            var particleEmitter = _this.game.add.emitter(0, 0, WorldConstants.ExplosionParticleCount);
            particleEmitter.makeParticles('particle');
            particleEmitter.gravity = WorldConstants.Gravity;
            return particleEmitter;
        };
        this.colourParticles = function (particle) {
        };
        this.game = new Game(WorldConstants.WorldWidth, WorldConstants.WorldHeight, Phaser.AUTO, 'content', { init: this.init, preload: this.preload, create: this.create });
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
var WorldConstants = (function () {
    function WorldConstants() {
    }
    WorldConstants.WorldWidth = 800;
    WorldConstants.WorldHeight = 600;
    WorldConstants.GroundLevel = 568;
    WorldConstants.MinLengthNumberGeneration = 5;
    WorldConstants.MaxLengthNumberGeneration = 25;
    WorldConstants.FireworkCreationTick = Phaser.Timer.SECOND / 5;
    WorldConstants.FireworkTransitionTick = Phaser.Timer.SECOND / 2;
    WorldConstants.Gravity = 50;
    WorldConstants.ParticleLifespanMilliseconds = 10000;
    WorldConstants.ExplosionParticleCount = 100;
    return WorldConstants;
}());
//# sourceMappingURL=app.js.map