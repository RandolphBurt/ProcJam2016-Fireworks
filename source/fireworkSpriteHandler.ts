class FireworkSpriteHandler {
    constructor(readonly game:Game, readonly fireworkSpritesGroup:Phaser.Group) {
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
        fireworkSprite.anchor.setTo(0.5, 0.5);

        fireworkSprite.angle = angle;
        fireworkSprite.body.velocity.setTo(0, 0);
        fireworkSprite.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(angle, speed));

        return fireworkSprite;
    }

    public rotateSprites = (spriteList:any[], angularVelocity:number) => {
        for (let sprite of spriteList) {
            sprite.body.angularVelocity += angularVelocity;
        }
    }

    public setVelocity = (spriteList:any[]) => {
        for (let sprite of spriteList) {
            sprite.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(sprite.angle, sprite.speed));
        }
    }

    public disposeSprites = (spriteList:any[]) => {
        for (let sprite of spriteList) {
            sprite.destroy();
        }
    }
}