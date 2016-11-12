class WorldConstants {
    public static WorldWidth:number = 800;
    public static WorldHeight:number = 600;
    public static GroundLevel:number = 584;
    public static Gravity:number = 50;

    public static MinLengthNumberGeneration = 5;
    public static MaxLengthNumberGeneration = 25;

    public static FireworkCreationTick:number = Phaser.Timer.SECOND / 5;
    public static FireworkTransitionTick:number = Phaser.Timer.SECOND / 2;

    public static ParticleLifespanMilliseconds:number = 2000;
    public static ExplosionParticleCount:number = 100;

    public static FireworkRotationRange = 45;
    public static FireworkMaxRotation = 22;
}