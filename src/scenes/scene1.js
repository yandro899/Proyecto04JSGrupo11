export class Scene1 extends Phaser.Scene {

    constructor()
    {
        super("Scene1");
    }

    preload()
    {
        this.load.spritesheet('nave','../../public/img/nave.png',{frameWidth:70,frameHeight:62});
        this.load.image('fuego', '../../public/img/red.png');
        this.load.image('cielo', '../../public/img/sky.png');
        this.load.image('bala', '../../public/img/shoot.png');
    }

    create() {
        this.add.image(400, 300, 'cielo');
        this.balas = [];
        const particles = this.add.particles(-10, 0, 'fuego', {
            speed: 100,
            angle: {min: 150, max: 210},
            scale: { start: 2, end: 0 },
            blendMode: 'ADD'
        });

        this.input.keyboard.on('keydown-SPACE', ()=> {
            console.log("HOLA");
            let bala = this.physics.add.sprite(this.player.x+10, this.player.y, 'bala');
            bala.setVelocityX(200);
            this.balas.push(bala);
        }, this);

        this.player = this.physics.add.sprite(100,100,'nave');

        this.player.setCollideWorldBounds(true);

        particles.startFollow(this.player);

        this.anims.create({
            key: 'stand',
            frames: [ { key: 'nave', frame: 0 } ],
            frameRate: 10,
        });
        this.anims.create({
            key: 'up',
            frames: [ { key: 'nave', frame: 2 } ],
            frameRate: 10,
        });
        this.anims.create({
            key: 'down',
            frames: [ { key: 'nave', frame: 1 } ],
            frameRate: 10,
        });

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

        //this.input.keyboard.on('keydown-Space', ()=> {console.log("HOLA");}, this);

        /* if (this.cursors.spacebar.isDown)
        {
            console.log("hola");
        } */


    }
}