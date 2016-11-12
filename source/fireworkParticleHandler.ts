class FireworkParticleHandler {
    constructor(readonly game:Game) {        
    }

    public createParticleEmitter = () : Emitter => {
        let particleEmitter = this.game.add.emitter(0, 0, WorldConstants.ExplosionParticleCount);
        particleEmitter.makeParticles('particle');
        particleEmitter.autoAlpha = true;
        particleEmitter.setAlpha(1, 0, WorldConstants.ParticleLifespanMilliseconds);

        particleEmitter.gravity = WorldConstants.Gravity;

        return particleEmitter;       
    }

    public emitParticles = (particleEmitter:Emitter, x:number, y:number, color:Phaser.Color, particleCount:number) => {
        particleEmitter.x = x;
        particleEmitter.y = y;
        particleEmitter.forEach((particle:any) => { particle.tint = color; }, this);

        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The third is ignored when using burst/explode mode
        particleEmitter.start(true, WorldConstants.ParticleLifespanMilliseconds, null, particleCount);
    }

    public disposeEmitters= (particleEmitterList:Emitter[]) => {
        this.game.time.events.add(WorldConstants.ParticleLifespanMilliseconds, () => {
            for (let emitter of particleEmitterList) {
                emitter.destroy();
            }
        }, this);
    }
}