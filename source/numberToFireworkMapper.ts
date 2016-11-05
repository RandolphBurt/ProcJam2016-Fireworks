class NumberToFireworkMapper {
    public static colourSpectrum:Phaser.Color[] = [
        Phaser.Color.createColor(255, 165, 0),      // Orange
        Phaser.Color.createColor(0, 0, 255),        // Blue
        Phaser.Color.createColor(255, 0, 0),        // Red
        Phaser.Color.createColor(255, 0, 255),      // Magenta
        Phaser.Color.createColor(0, 255, 0),        // Green
        Phaser.Color.createColor(0, 255, 255),      // Cyan
        Phaser.Color.createColor(255, 255, 0),      // Yellow
        Phaser.Color.createColor(255, 255, 255),    // White
        Phaser.Color.createColor(147, 112, 219),    // Medium Purple 
        Phaser.Color.createColor(255, 215, 0),      // Gold
    ];

    public map = (input:string) : Firework => {
        let position = input.substr(0, 2);
        let movementTransitions = input.substr(2, input.length - 3);
        let colour = input[input.length - 1]; 
        
        let firework = new Firework(this.translateStartPosition(position));
        this.addMovementTransitions(firework, movementTransitions);
        this.addExplosionTransition(firework, colour);

        return firework;
    }

    private addExplosionTransition = (firework:Firework, transition:string) => {
        firework.addTransition(new FireworkTransition(FireworkTransitionType.Explode, this.translateColour(transition)));
    }

    private addMovementTransitions = (firework:Firework, transitions:string) => {
        let previousCharacter:string = null;
        for (var c of transitions) {
            if (previousCharacter === c) {
                firework.addTransition(new FireworkTransition(FireworkTransitionType.Split, this.translateColour(c)));
            } else {
                firework.addTransition(new FireworkTransition(FireworkTransitionType.Move, this.translateAngle(c)));
            }
            previousCharacter = c;
        }
    }

    private translateStartPosition = (position:string) : number => {
        return parseInt(position);
    }

    private translateColour = (colour:string) :Phaser.Color => {
        return NumberToFireworkMapper.colourSpectrum[parseInt(colour)];
    }

    private translateAngle = (value:string) :number => {
        return (parseInt(value) * 90) - 45;
    }
}