export class Scene1 extends Phaser.Scene {

    constructor()
    {
        super("Scene1");
    }

    preload()
    {
        this.canvas = this.sys.game.canvas;
        this.load.spritesheet('nave','../../public/img/nave.png',{frameWidth:70,frameHeight:62});
        this.load.image('enemigo', '../../public/img/enemy.png',{frameWidth:70,frameHeight:62} );
        this.load.image('fuego', '../../public/img/red.png');
        this.load.image('cielo', '../../public/img/sky.png');
        this.load.image('bala', '../../public/img/shoot.png');
        this.load.image('fire', '../../public/img/yellow.png');
        this.load.image('impact', '../../public/img/orange2.png');
        this.load.audio('laser', '../../public/img/blaster-11.mp3');
        this.load.audio('crash', '../../public/img/crash.mp3');
        this.load.audio('musica', '../../public/img/bgmlvl1.mp3');
    }

    create() {
        console.log('1');
        this.lifeText ="";
        this.playerLife = 100;
        this.scoreText ="";
        this.score = 0;
        //sonido para el disparo
        this.laser = this.sound.add('laser');
        this.laser.setVolume(0.5);
        //sonido cuando una nave enemiga impacta al jugador 
        this.crash = this.sound.add('crash');
        this.laser.setVolume(0.5);

        this.musica = this.sound.add('musica');
        this.musica.play();

        this.add.image(400, 300, 'cielo');
        const particles = this.add.particles(-10, 0, 'fuego', {
            speed: 100,
            angle: {min: 150, max: 210},
            scale: { start: 3, end: 0 },
            blendMode: 'ADD'
        });

        // balas del player
        this.balas = this.physics.add.group();

        // enemigos
        this.enemyGroup = this.physics.add.group();

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

        // creacion de las balas al presionar SPACE
        this.input.keyboard.on('keydown-SPACE', ()=> {
            this.laser.play();
            let bala = this.balas.create(this.player.x+10, this.player.y, 'bala');
            bala.setVelocityX(500);
        }, this);

        //creacion de un evento para que se repita infinitamente, crea a los enemigos
        this.time.addEvent({
            delay: 1500,
            callback: this.crearEnemigos,
            callbackScope: this,
            repeat: -1
        });
        //colision entre las balas y los enemigos
        this.physics.add.overlap(this.balas, this.enemyGroup, (bala, enemigo)=>{
            this.add.particles(bala.x, bala.y, 'fire', {
                speed: 100,
                scale: { start: 3, end: 1.5 },
                blendMode: 'ADD',
                duration: 200
            });
            bala.destroy();
            enemigo.destroy();
            this.score += 10;
            this.scoreText.setText('Puntos: ' + this.score);
         }, null, this);

        //colision entre el jugador y los enemigos
        this.physics.add.overlap(this.player, this.enemyGroup, (player, enemigo)=>{
            this.crash.play();
            enemigo.destroy();
            this.add.particles(player.x+20, player.y, 'impact', {
                speed: 50,
                scale: { start: 5, end: 1.5 },
                blendMode: 'ADD',
                duration: 300
            });
            //al chocar el player pierde 10 de vida
            this.playerLife -= 10;
            this.lifeText.setText('Vida: ' + this.playerLife);
        })

        //textos para la vida y los puntos del jugador
        this.lifeText = this.add.text(500, 16, 'Vida: 100 ', { fontSize: '30px', fill: '#fff' });
        this.scoreText = this.add.text(16, 16, 'Puntos: 0', { fontSize: '30px', fill: '#fff' });

    }

    update() {
        //destruye al enemigo si se sale de la pantalla
        this.balas.children.iterate((children)=>{
            if(children && children.x > this.canvas.width)
                children.destroy();
        });

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
        //pasa los puntos a la escena de perdiste para mostrarlos, hace falta(?)
        if(this.playerLife <= 0){
            let pasarPuntos = this.score;
            this.puntos = 0;
            this.musica.stop();
            this.scene.start('perdiste',{puntos: pasarPuntos});
        }
        //pasa los puntos actuales a la escena 2
        if(this.score >= 1000){
            let pasarPuntos = this.score;
            this.puntos = 0;
            this.musica.stop();
            this.scene.start('Scene2',{puntos: pasarPuntos});
        }

    }

    crearEnemigos(){
        for (let index = 0; index < 5; index++) {

            let posicionYnave = Phaser.Math.Between(50, 550);
            let enemy = this.enemyGroup.create(900, posicionYnave, 'enemigo');
            enemy.setVelocityX(Phaser.Math.Between(-350,-150));
        }
    }
 
}