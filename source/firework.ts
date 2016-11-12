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
        public readonly startXPercentage:number,
        readonly fireworkSpriteHandler: FireworkSpriteHandler, 
        readonly fireworkParticleHandler: FireworkParticleHandler,
        readonly gameClock:GameClock) 
        {            
        }

    public launch = () => {
        // TODO: Set the speed/direction based on something?
        let sprite = this.fireworkSpriteHandler.createFireworkSprite(this.startXPercentage, -90, 50);
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
        this.fireworkSpriteHandler.rotateSprites(this.spriteList, transition.angularVelocity);
    }

    private handleExplosion = (transition:FireworkTransition) => {
        this.emitParticles(transition.color);
        this.fireworkSpriteHandler.disposeSprites(this.spriteList);
        this.fireworkParticleHandler.disposeEmitters( this.particleEmitterList);
    }

    private handleSplit = (transition:FireworkTransition) => {
        // TODO: foreach sprite...
            // duplicate sprite - set one to go left and one to go right - add to new list
            // Also trigger mini explosions of transition colour
        // Then assign new list to sprite list
        this.emitParticles(transition.color);
    }

    private emitParticles = (color:Phaser.Color) => {
        for (let i = 0; i < this.spriteList.length; i++) {
            let particleEmitter = this.particleEmitterList[i];
            let sprite = this.spriteList[i];

            particleEmitter.x = sprite.x;
            particleEmitter.y = sprite.y;
            particleEmitter.forEach((particle:any) => { particle.tint = color; }, this);

            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The third is ignored when using burst/explode mode
            particleEmitter.start(true, WorldConstants.ParticleLifespanMilliseconds, null, WorldConstants.ExplosionParticleCount);
        }
    }
}
