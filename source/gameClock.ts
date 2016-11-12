class GameClock {
    constructor(readonly game:Game) {        
    }

    public getGameTimeElapsed = () : number => {
        return this.game.time.totalElapsedSeconds();
    }
}