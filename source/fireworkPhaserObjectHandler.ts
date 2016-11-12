class FireworkPhaserObjectHandler {
    constructor(private game:Game, private fireworkSpritesGroup:Phaser.Group) {
    }

    public getGameTimeElapsed = () : number => {
        return this.game.time.totalElapsedSeconds();
    }

    public createFireworkSprite = (startXPercentage:number, angle:number, speed:number) : any => {
        let fireworkSprite = this.fireworkSpritesGroup.getFirstExists(false);

        let startXPosition:number = WorldConstants.WorldWidth * startXPercentage / 100;
        if (!fireworkSprite) {
            fireworkSprite = this.fireworkSpritesGroup.create(startXPosition, WorldConstants.GroundLevel, 'firework');
        } else {
            fireworkSprite.reset(startXPosition, WorldConstants.GroundLevel);
        }
        this.game.physics.enable(fireworkSprite, Phaser.Physics.ARCADE);

        fireworkSprite.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(angle, speed));

        return fireworkSprite;
    }

    public createParticleEmitter = () : Emitter => {
        let particleEmitter = this.game.add.emitter(0, 0, WorldConstants.ExplosionParticleCount);
        particleEmitter.makeParticles('particle');
        particleEmitter.autoAlpha = true;
        particleEmitter.setAlpha(1, 0, WorldConstants.ParticleLifespanMilliseconds);

        particleEmitter.gravity = WorldConstants.Gravity;

        return particleEmitter;       
    }

    public disposePhaserObjects= (spriteList:any[], particleEmitterList:Emitter[]) => {
        for (let sprite of spriteList) {
            sprite.destroy();
        }

        this.game.time.events.add(WorldConstants.ParticleLifespanMilliseconds, () => {
            for (let emitter of particleEmitterList) {
                emitter.destroy();
            }
        }, this);
    }

}