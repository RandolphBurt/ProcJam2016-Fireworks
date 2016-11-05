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
        let position = this.translateStartPosition(input.substr(0, 2));
        let colour = this.translateColour(input.substr(2, 1));
        
        let firework = new Firework(position, colour);

        this.addTransitions(firework, input.substr(3));

        return firework;
    }

    private addTransitions = (firework:Firework, transitions:string) => {
        let previousCharacter:string = null;
        for (var c of transitions) {
            if (previousCharacter === c) {
                firework.addTransition(new FireworkTransition(FireworkTransitionType.Split));
            } else {
                firework.addTransition(new FireworkTransition(FireworkTransitionType.Move, this.translateAngle(c)));
            }
            previousCharacter = c;
        }
        firework.addTransition(new FireworkTransition(FireworkTransitionType.Explode));
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