export class Scene2 extends Phaser.Scene{

    vidaText="";
    vidaBoss = 500;

    constructor()
    {
        super("Scene2");
    }

    preload(){
        this.canvas = this.sys.game.canvas;
        
        this.load.spritesheet('nave2','../public/img/nave2.png',{ frameWidth: 71, frameHeight: 62 });
        this.load.spritesheet('enemy2','../public/img/enemy2.png',{ frameWidth: 70, frameHeight: 62 });
        this.load.image('boss','../public/img/naveGrande.png');
        this.load.image('noche', '../../public/img/nigth.png');
        this.load.image('fire', '../../public/img/yellow.png');
        this.load.image('bigshoot', '../../public/img/bigshoot.png');
        this.load.image('bala', '../../public/img/shoot.png');
        this.load.image('disparoEnemigo', '../../public/img/shootEnemy.png')
    }

    create(){
        this.add.image(400, 300, 'noche');

        // Cooldowns
        this.cooldownSuperBullet = {
            cooldown:   5,
            nextTimeShoot: 0
        }
        this.nextEnemySpawn = 0;

        //crea las particulas
        const particles = this.add.particles(-10, 0, 'fire', {
            speed: 100,
            angle: {min: 150, max: 210},
            scale: { start: 1, end: 2 },
            blendMode: 'ADD'
        });
        this.add.particles()
        // balas
        this.bullets = this.physics.add.group();
        this.superBullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();

        // Enemigos basicos
        this.enemies2 = this.physics.add.group();
        
        // Para obtener las teclas es 'keydown-[tecla]' donde se encuentra en
        // https://newdocs.phaser.io/docs/3.60.0/Phaser.Input.Keyboard.KeyCodes

        
        //Ejecucion de disparos
        this.input.keyboard.on('keydown-SPACE', ()=> {
            let bala = this.bullets.create(this.player.x+10, this.player.y, 'bala');
            bala.setVelocityX(500);
        }, this);

        this.input.keyboard.on('keydown-Z', ()=> {
            let nextSuperBulletShoot = this.cooldownSuperBullet.nextTimeShoot;
            if (nextSuperBulletShoot>this.game.getTime())
                return;
            let bala = this.superBullets.create(this.player.x+10, this.player.y, 'bigshoot');
            this.cooldownSuperBullet.nextTimeShoot = this.cooldownSuperBullet.cooldown*1000+this.game.getTime();
            bala.setVelocityX(200);
        }, this);

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
        
        // COMENTADO PARA AGREGAR MAS TARDE
        //crea al jefe
        
        this.boss = this.physics.add.image(700,100, 'boss');
        
        this.boss.setCollideWorldBounds(true);
        this.boss.setVelocityY(200);
        this.boss.setBounce(1);   

        this.vidaText = this.add.text(16, 16, 'Vida: 0', { fontSize: '20px', fill: '#fff' });

        

        //detecta las coliciones tre las balas y enemigos
        this.physics.add.collider(this.bullets, this.enemies2, (bala, enemigo)=>{
            this.add.particles(bala.x, bala.y, 'fire', {
                speed: 150,
                scale: { start: 1, end: 1.5 },
                blendMode: 'ADD',
                duration: 200
            });
            bala.destroy();
            enemigo.destroy();

        }, null, this);
        this.physics.add.collider(this.superBullets, this.enemies2, (bala, enemigo)=>{
            enemigo.destroy();
            bala.setVelocityX(200);
            bala.setVelocityY(0);
        }, null, this);

        
        // colicion de las balas con el jefe y disminuye vida
        
        this.physics.add.collider(this.bullets, this.boss, (jefe, bala)=>{
            this.vidaBoss -= 5;
            console.log(this.vidaBoss);
            bala.destroy();
            jefe.setVelocityX(0);
            jefe.body.setImmovable(true);
            this.vidaText.setText('Vida: ' + this.vidaBoss);
            
        }, null, this); 

        this.physics.add.collider(this.superBullets, this.boss, (jefe, bala)=>{
            this.vidaBoss -= 10;
            console.log(this.vidaBoss);
            bala.destroy();
            jefe.setVelocityX(0);
            jefe.body.setImmovable(true);
            this.vidaText.setText('Vida: ' + this.vidaBoss);
        }, null, this); 

        this.cursors = this.input.keyboard.createCursorKeys();
        //console.log(this.canvas.width);
    }

    update() {
        // Las balas que salgan del mapa se borran
        this.bullets.children.iterate((children)=>{
            if(children && children.x > this.canvas.width)
                children.destroy();
        });

        this.superBullets.children.iterate((children)=>{
            if(children && children.x > this.canvas.width)
                children.destroy();
        });

        // Think enemies
        if (this.enemies2.countActive(true) < 10)
        {
            if (this.nextEnemySpawn <= this.game.getTime())
            {
                let enemy = this.enemies2.create(900, Phaser.Math.Between(100, 700), 'enemy2');
                enemy.setVelocityX(-200)
                this.nextEnemySpawn = this.game.getTime() + Phaser.Math.Between(50, 200)       
            }
        }
        this.enemies2.children.iterate((children)=>{
            if(children && children.x < -20)
                children.destroy();
        });     

        // Movimiento player
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