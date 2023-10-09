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
        this.load.image('enemigo', '../../public/img/enemy.png');
    }

    create() {
        this.add.image(400, 300, 'cielo');
        //this.balas = [];
        const particles = this.add.particles(-10, 0, 'fuego', {
            speed: 100,
            angle: {min: 150, max: 210},
            scale: { start: 2, end: 0 },
            blendMode: 'ADD'
        });
        //disparo al presiona la tecla SPACE
        let balasGroup = this.physics.add.group();
        this.input.keyboard.on('keydown-SPACE', ()=>{
            this.crearBalas(this.bala, balasGroup);
        }

            //console.log("HOLA");
            // let bala = this.physics.add.sprite(this.player.x+10, this.player.y, 'bala');
            // bala.setVelocityX(300);
            // this.balas.push(bala);
            // this.balas.forEach(element, index => {
            //     if (element.x <= 500) {
            //         delete(element[index]);
            //         console.log("bala eliminada");
            //     }
            // });
        , this);


        //creacion del player
        this.player = this.physics.add.sprite(100,100,'nave');
        this.player.setCollideWorldBounds(true);
        //creacion de particulas que seguiran al player
        particles.startFollow(this.player);
        //creacion de las animaciones del player
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
        //creacion de enemigos
        this.crearEnemigos(this.enemy);

        this.time.addEvent({
            delay: 3000,
            callback: this.crearEnemigos,
            callbackScope: this,
            repeat: -1
        })

    }

    update() {
        //movimiento del player al presionar las flechas, arriba, abajo, izquierda y derecha
        let velocity = 300;
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
        //hh

    }

    crearEnemigos(enemy){
        //console.log('hola');
        for (let index = 0; index < 5; index++) {

            let posicionXnave = 750;
            let posicionYnave = Phaser.Math.Between(50, 550);
            enemy = this.physics.add.sprite(posicionXnave, posicionYnave, 'enemigo');
            enemy.setVelocityX(-200);
        }
    }
    // eliminarEnemy(enemy, bala){
    //     enemy.disableBody(true, true);
    //     bala.disableBody(true, true);
    // }

    crearBalas(bala, balasGroup){
        bala = balasGroup.create(this.player.x+10, this.player.y, 'bala');
        bala.setVelocityX(300);
        bala.checkWorldBounds = true;
        bala.on('outOfBounds',()=>{
            bala.destroy();
        });
        
    }
}