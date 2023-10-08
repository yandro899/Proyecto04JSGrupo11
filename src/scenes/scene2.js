export class Scene2 extends Phaser.Scene{

    constructor()
    {
        super("Scene2");
    }

    preload(){
        this.load.spritesheet('nave2','../public/img/nave2.png',{ frameWidth: 71, frameHeight: 62 });
        this.load.spritesheet('enemy2','../public/img/enemy2.png',{ frameWidth: 70, frameHeight: 62 });
        this.load.image('boss','../public/img/naveGrande.png');
        this.load.image('noche', '../../public/img/nigth.png');
        this.load.image('fire', '../../public/img/yellow.png');
        this.load.image('bigshoot', '../../public/img/bigshoot.png');
        
    }

    create(){
        this.add.image(400, 300, 'noche');

        //crea las particulas
        const particles = this.add.particles(-10, 0, 'fire', {
            speed: 100,
            angle: {min: 150, max: 210},
            scale: { start: 1, end: 2 },
            blendMode: 'ADD'
        });

        this.player = this.physics.add.sprite(100,100,'nave2');

        this.player.setCollideWorldBounds(true);

        particles.startFollow(this.player);

        //crea animaciones de la nave
        this.anims.create({
            key: 'stand',
            frames: this.anims.generateFrameNumbers('nave2', { start: 0, end: 1 }),
            frameRate: 10,
        });
        this.anims.create({
            key: 'up',
            frames: [ { key: 'nave2', frame: 2 } ],
            frameRate: 10,
        });
        this.anims.create({
            key: 'down',
            frames: [ { key: 'nave2', frame: 4 } ],
            frameRate: 10,
        });

        //crea al jefe
        this.boss = this.physics.add.image(700,300, 'boss');

        let bossVelocity = 150;

        this.boss.setCollideWorldBounds(true);
        this.boss.setVelocityY(bossVelocity);
        this.boss.setBounce(1);
    

        
        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update() {
        let velocity = 200;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-1*velocity);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(velocity);
        }
        else if (this.cursors.up.isDown){
            this.player.setVelocityY(-1*velocity);
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown ) {
            this.player.setVelocityY(velocity);
            this.player.anims.play('down', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.anims.play('stand', true);
        }
    }

}