class FireworkFactory {
    private static colourSpectrum:number[] = [
        0xFFA500, // Orange
        0x0000FF, // Blue
        0xFF0000, // Red
        0xFF00FF, // Magenta
        0x00FF00, // Green
        0x00FFFF, // Cyan
        0xFFFF00, // Yellow
        0xFFFFFF, // White
        0x9370DB, // Medium Purple 
        0xFFD700, // Gold
    ];

    constructor(
        readonly fireworkSpriteHandler: FireworkSpriteHandler,
        readonly fireworkParticleHandler:FireworkParticleHandler,
        readonly gameClock:GameClock) {
    }

    public create = (input:string) : Firework => {
        let xStartPosition = input.substr(0, 2);
        let speedModifier = input.substr(2, 1);
        let startAngle = input.substr(3, 1);
        let movementTransitions = input.substr(2, input.length - 5);
        let colour = input[input.length - 1]; 
        
        let firework = new Firework(
            parseInt(xStartPosition), 
            parseInt(speedModifier), 
            this.translateAngle(startAngle), 
            this.fireworkSpriteHandler, 
            this.fireworkParticleHandler, 
            this.gameClock);

        this.addMovementTransitions(firework, movementTransitions);
        this.addExplosionTransition(firework, colour);

        return firework;
    }

    private addExplosionTransition = (firework:Firework, transition:string) => {
        firework.addTransition(new FireworkTransition(FireworkTransitionType.Explode, null, this.translateColour(transition)));
    }

    private addMovementTransitions = (firework:Firework, transitions:string) => {
        let previousCharacter:string = null;
        for (var c of transitions) {
            if (previousCharacter === c) {
                firework.addTransition(new FireworkTransition(FireworkTransitionType.Split, null, this.translateColour(c)));
            } else {
                firework.addTransition(new FireworkTransition(FireworkTransitionType.Move, this.translateAngle(c)));
            }
            previousCharacter = c;
        }
    }

    private translateColour = (colour:string) :number => {
        return FireworkFactory.colourSpectrum[parseInt(colour)];
    }

    private translateAngle = (value:string) :number => {
         return (parseInt(value) * WorldConstants.FireworkRotationRange / 9) - WorldConstants.FireworkRotationRange / 2;
    }
}