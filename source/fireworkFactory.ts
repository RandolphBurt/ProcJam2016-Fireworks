class FireworkFactory {
    public static colourSpectrum:number[] = [
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
        let position = input.substr(0, 2);
        let movementTransitions = input.substr(2, input.length - 3);
        let colour = input[input.length - 1]; 
        
        let firework = new Firework(this.translateStartPosition(position), this.fireworkSpriteHandler, this.fireworkParticleHandler, this.gameClock);
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

    private translateStartPosition = (position:string) : number => {
        return parseInt(position);
    }

    private translateColour = (colour:string) :number => {
        return FireworkFactory.colourSpectrum[parseInt(colour)];
    }

    private translateAngle = (value:string) :number => {
        return (parseInt(value) * 90) - 45;
    }
}