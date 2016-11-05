import Point = Phaser.Point;

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
    constructor(transitionType:FireworkTransitionType, color?:Phaser.Color)
    constructor(transitionType:FireworkTransitionType, angle?:number)
    constructor(public transitionType:FireworkTransitionType, public angle?:number, public color?:Phaser.Color) {
    }
}

class Firework {
    private transitionList:FireworkTransition[] = [];
    private spriteList:any[] = [];
    private state:FireworkState = FireworkState.InActive;
    private nextTransitionEventTime:number = 0;
    
    constructor(public readonly startXPercentage:number) {
    }

    public addTransition = (transition: FireworkTransition) => {
        this.transitionList.push(transition);
    }

    public addSprite = (sprite:any) => {
        this.spriteList.push(sprite);
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
        }
    }

    public setNextTransitionEventTime = (nextTransitionEvent:number) => {
        if (this.state === FireworkState.InActive) {
            this.state = FireworkState.Active;
        }
        this.nextTransitionEventTime = nextTransitionEvent;
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

    private handleMove = (transition:FireworkTransition) => {
        // TODO: Foreach sprite, set the angle
    }

    private handleExplosion = (transition:FireworkTransition) => {
        // TODO: Foreach sprite, create particles (with transition color) and then kill sprite list
    }

    private handleSplit = (transition:FireworkTransition) => {
        // TODO: foreach sprite...
            // duplicate sprite - set one to go left and one to go right - add to new list
            // Also trigger mini explosions of transition colour
        // Then assign new list to sprite list
    }
}
