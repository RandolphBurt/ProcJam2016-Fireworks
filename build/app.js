window.onload = function () {
    var gameState = new MainState();
};
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
    function FireworkTransition(transitionType, angularVelocity, color) {
        this.transitionType = transitionType;
        this.angularVelocity = angularVelocity;
        this.color = color;
    }
    return FireworkTransition;
}());
var Firework = (function () {
    function Firework(startXPercentage, startSpeedModifier, startAngle, fireworkSpriteHandler, fireworkParticleHandler, gameClock) {
        var _this = this;
        this.startXPercentage = startXPercentage;
        this.startSpeedModifier = startSpeedModifier;
        this.startAngle = startAngle;
        this.fireworkSpriteHandler = fireworkSpriteHandler;
        this.fireworkParticleHandler = fireworkParticleHandler;
        this.gameClock = gameClock;
        this.transitionList = [];
        this.spriteList = [];
        this.particleEmitterList = [];
        this.state = FireworkState.InActive;
        this.nextTransitionEventTime = 0;
        this.launch = function () {
            var sprite = _this.fireworkSpriteHandler.createFireworkSprite(_this.startXPercentage, _this.startAngle - 90, 20 + (_this.startSpeedModifier * 10));
            _this.spriteList.push(sprite);
            var particleEmitter = _this.fireworkParticleHandler.createParticleEmitter();
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
        this.setVelocity = function () {
            if (_this.state == FireworkState.Active) {
                _this.fireworkSpriteHandler.setVelocity(_this.spriteList);
            }
        };
        this.setNextTransitionEventTime = function () {
            if (_this.state === FireworkState.InActive) {
                _this.state = FireworkState.Active;
            }
            _this.nextTransitionEventTime = _this.gameClock.getGameTimeElapsed() + 1;
        };
        this.handleMove = function (transition) {
            for (var _i = 0, _a = _this.spriteList; _i < _a.length; _i++) {
                var sprite = _a[_i];
                _this.fireworkSpriteHandler.rotateSprite(sprite, transition.angularVelocity);
            }
        };
        this.handleExplosion = function (transition) {
            _this.emitParticles(transition.color, WorldConstants.ExplosionParticleCount);
            _this.fireworkSpriteHandler.disposeSprites(_this.spriteList);
            _this.fireworkParticleHandler.disposeEmitters(_this.particleEmitterList);
        };
        this.handleSplit = function (transition) {
            var newSprites = [];
            for (var _i = 0, _a = _this.spriteList; _i < _a.length; _i++) {
                var sprite = _a[_i];
                sprite.scale.x *= 0.5;
                sprite.scale.y *= 0.5;
                var newSprite = _this.fireworkSpriteHandler.copyFireworkSprite(sprite);
                _this.fireworkSpriteHandler.rotateSprite(sprite, transition.angularVelocity);
                _this.fireworkSpriteHandler.rotateSprite(newSprite, -1 * transition.angularVelocity);
                newSprites.push(newSprite);
                var particleEmitter = _this.fireworkParticleHandler.createParticleEmitter();
                _this.particleEmitterList.push(particleEmitter);
            }
            _this.emitParticles(transition.color, WorldConstants.SplitParticleCount);
            _this.spriteList = _this.spriteList.concat(newSprites);
        };
        this.emitParticles = function (color, particleCount) {
            for (var i = 0; i < _this.spriteList.length; i++) {
                var particleEmitter = _this.particleEmitterList[i];
                var sprite = _this.spriteList[i];
                _this.fireworkParticleHandler.emitParticles(particleEmitter, sprite.x, sprite.y, color, particleCount);
            }
        };
    }
    return Firework;
}());
var FireworkFactory = (function () {
    function FireworkFactory(fireworkSpriteHandler, fireworkParticleHandler, gameClock) {
        var _this = this;
        this.fireworkSpriteHandler = fireworkSpriteHandler;
        this.fireworkParticleHandler = fireworkParticleHandler;
        this.gameClock = gameClock;
        this.create = function (input) {
            var xStartPosition = input.substr(0, 2);
            var speedModifier = input.substr(2, 1);
            var startAngle = input.substr(3, 1);
            var movementTransitions = input.substr(2, input.length - 5);
            var colour = input[input.length - 1];
            var firework = new Firework(parseInt(xStartPosition), parseInt(speedModifier), _this.translateAngle(startAngle), _this.fireworkSpriteHandler, _this.fireworkParticleHandler, _this.gameClock);
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
        this.translateColour = function (colour) {
            return FireworkFactory.colourSpectrum[parseInt(colour)];
        };
        this.translateAngle = function (value) {
            return (parseInt(value) * WorldConstants.FireworkRotationRange / 9) - WorldConstants.FireworkRotationRange / 2;
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
var FireworkParticleHandler = (function () {
    function FireworkParticleHandler(game) {
        var _this = this;
        this.game = game;
        this.createParticleEmitter = function () {
            var particleEmitter = _this.game.add.emitter(0, 0, WorldConstants.ExplosionParticleCount);
            particleEmitter.makeParticles('particle');
            particleEmitter.autoAlpha = true;
            particleEmitter.setAlpha(1, 0, WorldConstants.ParticleLifespanMilliseconds);
            particleEmitter.gravity = WorldConstants.Gravity;
            return particleEmitter;
        };
        this.emitParticles = function (particleEmitter, x, y, color, particleCount) {
            particleEmitter.x = x;
            particleEmitter.y = y;
            particleEmitter.forEach(function (particle) { particle.tint = color; }, _this);
            particleEmitter.start(true, WorldConstants.ParticleLifespanMilliseconds, null, particleCount);
        };
        this.disposeEmitters = function (particleEmitterList) {
            _this.game.time.events.add(WorldConstants.ParticleLifespanMilliseconds, function () {
                for (var _i = 0, particleEmitterList_1 = particleEmitterList; _i < particleEmitterList_1.length; _i++) {
                    var emitter = particleEmitterList_1[_i];
                    emitter.destroy();
                }
            }, _this);
        };
    }
    return FireworkParticleHandler;
}());
var FireworkSpriteHandler = (function () {
    function FireworkSpriteHandler(game, fireworkSpritesGroup) {
        var _this = this;
        this.game = game;
        this.fireworkSpritesGroup = fireworkSpritesGroup;
        this.createFireworkSprite = function (startXPercentage, angle, speed) {
            var startXPosition = WorldConstants.WorldWidth * startXPercentage / 100;
            return _this.createSprite(startXPosition, WorldConstants.GroundLevel, angle, speed);
        };
        this.copyFireworkSprite = function (existingSprite) {
            var newSprite = _this.createSprite(existingSprite.x, existingSprite.y, existingSprite.angle, existingSprite.body.speed);
            newSprite.scale.x = existingSprite.scale.x;
            newSprite.scale.y = existingSprite.scale.y;
            return newSprite;
        };
        this.rotateSprite = function (sprite, angularVelocity) {
            sprite.body.angularVelocity += angularVelocity;
        };
        this.setVelocity = function (spriteList) {
            for (var _i = 0, spriteList_1 = spriteList; _i < spriteList_1.length; _i++) {
                var sprite = spriteList_1[_i];
                sprite.body.velocity.copyFrom(_this.game.physics.arcade.velocityFromAngle(sprite.angle, sprite.body.speed));
            }
        };
        this.disposeSprites = function (spriteList) {
            for (var _i = 0, spriteList_2 = spriteList; _i < spriteList_2.length; _i++) {
                var sprite = spriteList_2[_i];
                sprite.destroy();
            }
        };
        this.createSprite = function (x, y, angle, speed) {
            var fireworkSprite = _this.fireworkSpritesGroup.getFirstExists(false);
            if (!fireworkSprite) {
                fireworkSprite = _this.fireworkSpritesGroup.create(x, y, 'firework');
            }
            else {
                fireworkSprite.reset(x, y);
            }
            _this.game.physics.enable(fireworkSprite, Phaser.Physics.ARCADE);
            fireworkSprite.anchor.setTo(0.5, 0.5);
            fireworkSprite.angle = angle;
            fireworkSprite.body.velocity.copyFrom(_this.game.physics.arcade.velocityFromAngle(angle, speed));
            return fireworkSprite;
        };
    }
    return FireworkSpriteHandler;
}());
var GameClock = (function () {
    function GameClock(game) {
        var _this = this;
        this.game = game;
        this.getGameTimeElapsed = function () {
            return _this.game.time.totalElapsedSeconds();
        };
    }
    return GameClock;
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
        this.create = function () {
            _this.initialiseGame();
            _this.generateFireworks();
            _this.startGame();
        };
        this.update = function () {
            for (var _i = 0, _a = _this.fireworks; _i < _a.length; _i++) {
                var firework = _a[_i];
                firework.setVelocity();
            }
        };
        this.initialiseGame = function () {
            _this.gameClock = new GameClock(_this.game);
            _this.game.physics.startSystem(Phaser.Physics.ARCADE);
            _this.game.world.setBounds(0, 0, WorldConstants.WorldWidth, WorldConstants.WorldHeight);
            _this.game.scale.pageAlignHorizontally = true;
            _this.game.stage.backgroundColor = '#222222';
            _this.game.renderer.renderSession.roundPixels = true;
            _this.fireworkSpritesGroup = _this.game.add.physicsGroup();
        };
        this.generateFireworks = function () {
            _this.fireworks = [];
            var fireworkFactory = new FireworkFactory(new FireworkSpriteHandler(_this.game, _this.fireworkSpritesGroup), new FireworkParticleHandler(_this.game), _this.gameClock);
            var numberProceduralGeneration = new NumberProceduralGeneration(324, WorldConstants.NumberGenerationMinLength, WorldConstants.NumberGenerationMaxLength);
            var numbers = numberProceduralGeneration.generate(WorldConstants.IterationCountNumberGeneration);
            for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
                var number = numbers_1[_i];
                _this.fireworks.push(fireworkFactory.create(number));
            }
        };
        this.startGame = function () {
            _this.fireworkLaunchedCounter = 0;
            _this.fireworkCreationTimer = _this.game.time.events.loop(WorldConstants.FireworkCreationTick, _this.fireworkCreationTick, _this);
            _this.fireworkTransitionTimer = _this.game.time.events.loop(WorldConstants.FireworkTransitionTick, _this.fireworkTransitionTick, _this);
        };
        this.fireworkTransitionTick = function () {
            var elapsed = _this.gameClock.getGameTimeElapsed();
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
        this.game = new Game(WorldConstants.WorldWidth, WorldConstants.WorldHeight, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
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
    WorldConstants.GroundLevel = 592;
    WorldConstants.Gravity = 50;
    WorldConstants.NumberGenerationMinLength = 7;
    WorldConstants.NumberGenerationMaxLength = 15;
    WorldConstants.IterationCountNumberGeneration = 100;
    WorldConstants.FireworkCreationTick = Phaser.Timer.SECOND / 5;
    WorldConstants.FireworkTransitionTick = Phaser.Timer.SECOND / 2;
    WorldConstants.ParticleLifespanMilliseconds = 2000;
    WorldConstants.ExplosionParticleCount = 100;
    WorldConstants.SplitParticleCount = 20;
    WorldConstants.FireworkRotationRange = 45;
    WorldConstants.FireworkMaxRotation = 22;
    return WorldConstants;
}());
//# sourceMappingURL=app.js.map