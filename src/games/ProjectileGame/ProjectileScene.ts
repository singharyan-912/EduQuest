import Phaser from 'phaser';

export class ProjectileScene extends Phaser.Scene {
    private ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;
    private target: Phaser.Types.Physics.Arcade.SpriteWithStaticBody | null = null;
    private trajectoryGraphics: Phaser.GameObjects.Graphics | null = null;
    private isLaunched = false;
    private score = 0;
    private level = 1;

    constructor() {
        super('ProjectileScene');
    }

    preload() {
        // We'll use simple shapes if images aren't provided, 
        // but we can also use Unsplash placeholders for textures
    }

    create() {
        const { width, height } = this.scale;

        // Ground
        this.add.rectangle(0, height - 40, width * 2, 80, 0x1f2937).setOrigin(0);

        // Target
        this.target = this.physics.add.staticSprite(width - 150, height - 80, 'target') as any;
        if (!this.target.texture.key) {
            const rect = this.add.rectangle(width - 150, height - 80, 60, 60, 0xef4444).setOrigin(0.5);
            this.target = this.physics.add.existing(rect, true) as any;
        }

        // Projectile (Ball)
        this.resetBall();

        // Graphics for trajectory
        this.trajectoryGraphics = this.add.graphics();

        // Texts
        this.add.text(20, 20, 'Projectile Lab', { fontSize: '24px', fontStyle: '900', color: '#3b82f6' });
        const scoreText = this.add.text(20, 60, `Score: ${this.score}`, { fontSize: '18px', fontStyle: '700', color: '#94a3b8' });

        // Physics Colliders
        this.physics.add.collider(this.ball!, this.target, this.handleHit, undefined, this);

        // Registry listeners
        this.game.events.on('launch', this.launch, this);
    }

    resetBall() {
        const { height } = this.scale;
        
        if (this.ball) this.ball.destroy();
        
        const rect = this.add.circle(100, height - 80, 15, 0x3b82f6).setOrigin(0.5);
        this.ball = this.physics.add.existing(rect) as any;
        this.ball!.setCollideWorldBounds(true);
        this.ball!.body.setGravityY(800);
        this.ball!.body.enable = false;
        this.ball!.setVisible(true);
        
        this.isLaunched = false;
    }

    launch() {
        if (this.isLaunched) return;

        const data = this.game.registry.get('gameData') || { angle: 45, velocity: 50 };
        const angle = data.angle;
        const velocity = data.velocity * 10; // Scaling for physics

        const rad = Phaser.Math.DegToRad(-angle);
        const vx = Math.cos(rad) * velocity;
        const vy = Math.sin(rad) * velocity;

        this.ball!.body.enable = true;
        this.ball!.setVelocity(vx, vy);
        this.isLaunched = true;
    }

    handleHit() {
        this.score += 50;
        this.game.events.emit('scoreUpdate', this.score);
        
        // Effects
        this.cameras.main.shake(200, 0.01);
        
        if (this.score >= 150) {
            this.game.events.emit('gameComplete', this.score);
        } else {
            this.time.delayedCall(1000, () => {
                this.level++;
                this.resetBall();
                // Randomise target position for level 2
                this.target!.setX(Phaser.Math.Between(400, 750));
            });
        }
    }

    update() {
        if (this.isLaunched && this.ball!.y > this.scale.height - 40) {
            // Missed!
            this.time.delayedCall(500, () => this.resetBall());
        }

        // Draw trajectory preview if not launched
        if (!this.isLaunched && this.trajectoryGraphics) {
            this.drawTrajectory();
        }
    }

    drawTrajectory() {
        const data = this.game.registry.get('gameData') || { angle: 45, velocity: 50 };
        const angle = data.angle;
        const velocity = data.velocity * 10;
        const rad = Phaser.Math.DegToRad(-angle);
        
        const vx = Math.cos(rad) * velocity;
        const vy = Math.sin(rad) * velocity;
        const g = 800;

        this.trajectoryGraphics!.clear();
        this.trajectoryGraphics!.lineStyle(2, 0x3b82f6, 0.5);
        this.trajectoryGraphics!.beginPath();
        this.trajectoryGraphics!.moveTo(100, this.scale.height - 80);

        for (let t = 0; t < 2; t += 0.1) {
            const x = 100 + vx * t;
            const y = (this.scale.height - 80) + vy * t + 0.5 * g * t * t;
            this.trajectoryGraphics!.lineTo(x, y);
            if (y > this.scale.height - 40) break;
        }
        this.trajectoryGraphics!.strokePath();
    }
}
