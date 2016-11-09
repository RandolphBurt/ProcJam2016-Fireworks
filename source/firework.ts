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

interface FireworkCallbacks {
    createFireworkSprite(startXPercentage:number, angle:number, speed:number) : any;
    getGameTimeElapsed() : number;
}

class Firework {
    private transitionList:FireworkTransition[] = [];
    private spriteList:any[] = [];
    private state:FireworkState = FireworkState.InActive;
    private nextTransitionEventTime:number = 0;
    
    constructor(public readonly startXPercentage:number, readonly fireworkCallbacks: FireworkCallbacks) {
    }

    public launch = () => {
        // TODO: Set the speed/direction based on something?
        let sprite = this.fireworkCallbacks.createFireworkSprite(this.startXPercentage, -90, 300);
        this.spriteList.push(sprite);
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

    private setNextTransitionEventTime = () => {
        if (this.state === FireworkState.InActive) {
            this.state = FireworkState.Active;
        }
        // TODO: Maybe alter +1 based on something
        this.nextTransitionEventTime = this.fireworkCallbacks.getGameTimeElapsed() + 1;
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
