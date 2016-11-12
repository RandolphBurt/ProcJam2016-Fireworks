class FireworkSpriteHandler {
    constructor(readonly game:Game, readonly fireworkSpritesGroup:Phaser.Group) {
    }

    public createFireworkSprite = (startXPercentage:number, angle:number, speed:number) : any => {
        let startXPosition:number = WorldConstants.WorldWidth * startXPercentage / 100;
        return this.createSprite(startXPosition, WorldConstants.GroundLevel, angle, speed);
    }

    public copyFireworkSprite = (existingSprite:any) : any => {
        let newSprite = this.createSprite(existingSprite.x, existingSprite.y, existingSprite.angle, existingSprite.speed);
        newSprite.scale.x = existingSprite.scale.x;
        newSprite.scale.y = existingSprite.scale.y;
        return newSprite;
    }

    public rotateSprite = (sprite:any, angularVelocity:number) => {        
        sprite.body.angularVelocity += angularVelocity;
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

    private createSprite = (x:number, y:number, angle:number, speed:number) : any => {
        let fireworkSprite = this.fireworkSpritesGroup.getFirstExists(false);

        if (!fireworkSprite) {
            fireworkSprite = this.fireworkSpritesGroup.create(x, y, 'firework');
        } else {
            fireworkSprite.reset(x, y);
        }
        this.game.physics.enable(fireworkSprite, Phaser.Physics.ARCADE);
        fireworkSprite.anchor.setTo(0.5, 0.5);

        fireworkSprite.angle = angle;
        fireworkSprite.body.velocity.setTo(0, 0);
        fireworkSprite.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(angle, speed));

        return fireworkSprite;
    }
}