class WorldConstants {
    public static WorldWidth:number = 800;
    public static WorldHeight:number = 600;
    public static GroundLevel:number = 568;

    public static MinLengthNumberGeneration = 5;
    public static MaxLengthNumberGeneration = 25;

    public static FireworkCreationTick:number = Phaser.Timer.SECOND / 5;
    public static FireworkTransitionTick:number = Phaser.Timer.SECOND / 2;

    public static Gravity:number = 50;

    public static ParticleLifespanMilliseconds:number = 10000;
    public static ExplosionParticleCount:number = 100;
}