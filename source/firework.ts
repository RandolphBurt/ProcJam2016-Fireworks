enum FireworkTransitionType {
    Move,
    Split,
    Explode
}

enum FireworkState {
    InActive,
    Active,
    Finished
}

class FireworkTransition {
    constructor(public transitionType:FireworkTransitionType, public angularVelocity?:number, public color?:number) {
    }
}

class Firework {
    private transitionList:FireworkTransition[] = [];
    private spriteList:any[] = [];
    private particleEmitterList:Emitter[] = [];

    private state:FireworkState = FireworkState.InActive;
    private nextTransitionEventTime:number = 0;
    
    constructor(
        readonly startXPercentage:number,
        readonly startSpeedModifier:number,
        readonly startAngle:number,
        readonly fireworkSpriteHandler: FireworkSpriteHandler, 
        readonly fireworkParticleHandler: FireworkParticleHandler,
        readonly gameClock:GameClock) 
        {            
        }

    public launch = () => {
        let sprite = this.fireworkSpriteHandler.createFireworkSprite(
            this.startXPercentage, 
            this.startAngle - 90, // -90 to ensure we are facing up rather than to the right
            20 + (this.startSpeedModifier * 10));

        this.spriteList.push(sprite);

        let particleEmitter = this.fireworkParticleHandler.createParticleEmitter();
        this.particleEmitterList.push(particleEmitter);
        this.setNextTransitionEventTime();
    }

    public addTransition = (transition: FireworkTransition) => {
        this.transitionList.push(transition);
    }

    public runNextTransition = () => {
        let nextTransition = this.transitionList.shift();

        switch (nextTransition.transitionType) {
            case FireworkTransitionType.Move:
                this.handleMove(nextTransition);
                break;
            case FireworkTransitionType.Explode:
                this.handleExplosion(nextTransition);
                break;
            case FireworkTransitionType.Split:
                this.handleSplit(nextTransition);
                break;
        }
        if (this.transitionList.length === 0) {
            this.state = FireworkState.Finished;
        } else {
            this.setNextTransitionEventTime();
        }
    }

    public getNextTransitionEventTime = () : number => {
        return this.nextTransitionEventTime;
    }

    public hasStarted = () : boolean => {
        return this.state !== FireworkState.InActive;
    }

    public hasFinished = () : boolean => {
        return this.state === FireworkState.Finished;
    }

    public setVelocity = () => {
        if (this.state == FireworkState.Active) {
            this.fireworkSpriteHandler.setVelocity(this.spriteList);
        }
    }

    private setNextTransitionEventTime = () => {
        if (this.state === FireworkState.InActive) {
            this.state = FireworkState.Active;
        }
        // TODO: Maybe alter +1 based on something
        this.nextTransitionEventTime = this.gameClock.getGameTimeElapsed() + 1;
    }

    private handleMove = (transition:FireworkTransition) => {
        for (let sprite of this.spriteList) {
            this.fireworkSpriteHandler.rotateSprite(sprite, transition.angularVelocity);
        }
    }

    private handleExplosion = (transition:FireworkTransition) => {
        this.emitParticles(transition.color, WorldConstants.ExplosionParticleCount);
        this.fireworkSpriteHandler.disposeSprites(this.spriteList);
        this.fireworkParticleHandler.disposeEmitters( this.particleEmitterList);
    }

    private handleSplit = (transition:FireworkTransition) => {
        // duplicate sprite - set one to go left and one to go right - add to new list
        // Also trigger mini explosions of transition colour
        let newSprites:any[] = [];
        for (let sprite of this.spriteList) {
            sprite.scale.x *= 0.5;
            sprite.scale.y *= 0.5;
            let newSprite = this.fireworkSpriteHandler.copyFireworkSprite(sprite);
            this.fireworkSpriteHandler.rotateSprite(sprite, transition.angularVelocity);
            this.fireworkSpriteHandler.rotateSprite(newSprite, -1 * transition.angularVelocity);
            newSprites.push(newSprite);
            let particleEmitter = this.fireworkParticleHandler.createParticleEmitter();
            this.particleEmitterList.push(particleEmitter);
        }
        this.emitParticles(transition.color, WorldConstants.SplitParticleCount);
        this.spriteList = this.spriteList.concat(newSprites);        
    }    

    private emitParticles = (color:Phaser.Color, particleCount:number) => {
        for (let i = 0; i < this.spriteList.length; i++) {
            let particleEmitter = this.particleEmitterList[i];
            let sprite = this.spriteList[i];
            this.fireworkParticleHandler.emitParticles(particleEmitter, sprite.x, sprite.y, color, particleCount);
        }
    }
}
