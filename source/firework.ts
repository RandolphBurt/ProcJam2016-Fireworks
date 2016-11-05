import Point = Phaser.Point;

enum FireworkTransitionType {
    Move,
    Split,
    Explode
}

class FireworkTransition {
    // TODO: colour
    constructor(public readonly transitionType:FireworkTransitionType, public readonly angle?:number) {
        this.angle = angle;
        this.transitionType = transitionType;
    }
}

class Firework {
    private transitionList:FireworkTransition[] = [];
    private spriteList:any[] = [];
    
    constructor(public readonly startXPercentage:number, private readonly colour:Phaser.Color) {
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
                this.handleExplosion();
                break;
            case FireworkTransitionType.Split:
                this.handleSplit();
                break;
        }
    }

    public isFinished = () : boolean => {
        return this.transitionList.length === 0;
    }

    private handleMove = (transition:FireworkTransition) => {
        // TODO: Foreach sprite, set the angle
    }

    private handleExplosion = () => {
        // TODO: Foreach sprite, create particles and then kill sprite list
    }

    private handleSplit = () => {
        // TODO: foreach sprite...
            // duplicate sprite - set one to go left and one to go right - add to new list
        // Then assign new list to sprite list
    }
}
