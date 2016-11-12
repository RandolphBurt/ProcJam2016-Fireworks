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

        fireworkSprite.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(angle, speed));

        return fireworkSprite;
    }

    public disposeSprites = (spriteList:any[]) => {
        for (let sprite of spriteList) {
            sprite.destroy();
        }
    }

}