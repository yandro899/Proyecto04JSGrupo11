export class Scene2 extends Phaser.Scene{

    vidaText="";
    puntosText="";
    vidaBoss = 100;
    puntos = 0;

    constructor()
    {
        super("Scene2");
    }

    preload(){
        this.canvas = this.sys.game.canvas;
        
        this.load.spritesheet('nave2','../public/img/nave2.png',{ frameWidth: 71, frameHeight: 62 });
        this.load.spritesheet('enemy2','../public/img/enemy2.png',{ frameWidth: 70, frameHeight: 62 });
        this.load.spritesheet('explosion','../public/img/explosion.png',{ frameWidth: 30, frameHeight: 30 });
        this.load.spritesheet('dano','../public/img/navedaño.png',{ frameWidth: 71, frameHeight: 62 });
        this.load.image('boss','../public/img/naveGrande.png');
        this.load.image('noche', '../../public/img/nigth.png');
        this.load.image('fire', '../../public/img/yellow.png');
        this.load.image('bigshoot', '../../public/img/bigshoot.png');
        this.load.image('bala', '../../public/img/shoot.png');
        this.load.image('disparoEnemigo', '../../public/img/shootEnemy.png');
        this.load.image('superDisparoEnemigo', '../../public/img/red.png');
    }

    create(){
        this.add.image(400, 300, 'noche');

        // Cooldowns disparos player
        this.cooldownBullet = {
            cooldown:   100,
            nextTimeShoot: 0
        };
        this.cooldownSuperBullet = {
            cooldown:   5000,
            nextTimeShoot: 0
        }
        this.countSuperHits = 0;

        // Proxima aparicion enemigos
        this.nextEnemySpawn = 0;

        //crea las particulas del jugador
        const particles = this.add.particles(-10, 0, 'fire', {
            speed: 100,
            angle: {min: 150, max: 210},
            scale: { start: 1, end: 2 },
            blendMode: 'ADD'
        });
        
        // balas jugador
        this.bullets = this.physics.add.group();
        this.superBullets = this.physics.add.group();

        // Balas enemigo
        this.enemyBullets = this.physics.add.group();
        this.superEnemyBullets = this.physics.add.group();

        // Enemigos basicos
        this.enemies2 = this.physics.add.group();
        this.enemies2Count = {
            max : 100,
            count : 0
        };

        // Para obtener las teclas es 'keydown-[tecla]' donde se encuentra en
        // https://newdocs.phaser.io/docs/3.60.0/Phaser.Input.Keyboard.KeyCodes

        //Ejecucion de disparos jugador
        this.input.keyboard.on('keydown-SPACE', ()=> {
            let nextBulletShoot = this.cooldownBullet.nextTimeShoot;
            if (nextBulletShoot>this.game.getTime())
                return;
            let bala = this.bullets.create(this.player.x+10, this.player.y, 'bala');
            this.cooldownBullet.nextTimeShoot = this.cooldownBullet.cooldown+this.game.getTime();
            bala.setVelocityX(500);
        }, this);

        this.input.keyboard.on('keydown-Z', ()=> {
            let nextSuperBulletShoot = this.cooldownSuperBullet.nextTimeShoot;
            if (nextSuperBulletShoot>this.game.getTime())
                return;
            let bala = this.superBullets.create(this.player.x+10, this.player.y, 'bigshoot');
            this.cooldownSuperBullet.nextTimeShoot = this.cooldownSuperBullet.cooldown+this.game.getTime();
            bala.setVelocityX(200);
        }, this);

        // Instancia al jugador
        this.player = this.physics.add.sprite(100,100,'nave2');
        this.playerLifeSystem = {
            health: 100,
            nextTimeDamaged: 0
        };
        this.player.setCollideWorldBounds(true);
        particles.startFollow(this.player);

        //crea animaciones de la nave jugador
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
        
        //crea al jefe pero esta oculto hasta que llegue el momento de su aparicion
        this.boss = this.physics.add.image(1000,100, 'boss');
        this.boss.setBounce(1);  
        this.bossStart = false; 
        this.bossShootManager = {
            nextSimpleShootTime: 0,
            simpleShootCooldown: 500,
            nextSuperShootTime: 0,
            superShootCooldown: 10000
        };

        // Textos
        this.vidaText = this.add.text(16, 16, ' ', { fontSize: '20px', fill: '#fff' });
        this.vidaPlayerText = this.add.text(500, 16, 'Vida Jugador: 100 ', { fontSize: '50px', fill: '#fff' });
        this.puntosText = this.add.text(16, 0, 'Puntos: 0', { fontSize: '20px', fill: '#fff' });

        this.anims.create({
            key: 'explotar',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 5 }),
            frameRate: 10,
        });

        //detecta las coliciones entre las balas y enemigos
        this.physics.add.overlap(this.bullets, this.enemies2, (bala, enemigo)=>{
            bala.destroy();
            enemigo.destroy();
            this.puntos += 10;
            this.puntosText.setText('Puntos: ' + this.puntos);
            this.exp = this.add.sprite(bala.x + 30, bala.y, 'explosion');
            this.exp.anims.play('explotar', true);

        }, null, this);
        this.physics.add.overlap(this.superBullets, this.enemies2, (bala, enemigo)=>{
            enemigo.destroy();
            this.puntos += 10*Math.pow(2,this.countSuperHits);
            this.countSuperHits++;
            this.puntosText.setText('Puntos: ' + this.puntos);
            this.exp = this.add.sprite(bala.x + 30, bala.y, 'explosion');
            this.exp.anims.play('explotar', true);
        }, null, this);

        
        // colicion de las balas con el jefe y disminuye vida
        this.physics.add.overlap(this.bullets, this.boss, (jefe, bala)=>{
            if (!this.bossStart)
                return;
            this.vidaBoss -= 5;
            bala.destroy();
            this.vidaText.setText('Vida Jefe: ' + this.vidaBoss);
            this.puntos += 10;
            this.puntosText.setText('Puntos: ' + this.puntos);
            this.exp = this.add.sprite(bala.x + 30, bala.y, 'explosion');
            this.exp.anims.play('explotar', true);
        }, null, this); 

        this.physics.add.overlap(this.superBullets, this.boss, (jefe, bala)=>{
            if (!this.bossStart)
                return;
            this.vidaBoss -= 30;
            bala.destroy();
            this.vidaText.setText('Vida Jefe: ' + this.vidaBoss);
            this.puntos += 10*Math.pow(2,this.countSuperHits);
            this.countSuperHits = 0;
            this.puntosText.setText('Puntos: ' + this.puntos);
            this.exp = this.add.sprite(bala.x + 30, bala.y, 'explosion');
            this.exp.anims.play('explotar', true);
        }, null, this); 

        // Colisiones del jugador con los enemigos basicos
        this.physics.add.overlap(this.player, this.enemies2, (player, enemy)=>{
            if (this.playerLifeSystem.nextTimeDamaged > this.game.getTime())
                return;
            enemy.destroy();
            this.playerLifeSystem.health = this.playerLifeSystem.health - 5;
            this.playerLifeSystem.nextTimeDamaged = this.game.getTime() + 1000;
        }, null, this);

        // Colision del jugador con las balas enemigas
        this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet)=>{
            if (this.playerLifeSystem.nextTimeDamaged > this.game.getTime())
                return;
            bullet.destroy();
            this.playerLifeSystem.health = this.playerLifeSystem.health - 5;
            this.playerLifeSystem.nextTimeDamaged = this.game.getTime() + 1000;
        }, null, this);

        // Colision del jugador con las super balas enemigas
        this.physics.add.overlap(this.player, this.superEnemyBullets, (player, bullet)=>{
            if (this.playerLifeSystem.nextTimeDamaged > this.game.getTime())
                return;
            bullet.destroy();
            this.playerLifeSystem.health = this.playerLifeSystem.health - 15;
            this.playerLifeSystem.nextTimeDamaged = this.game.getTime() + 1000;
        }, null, this);

        this.anims.create({
            key: 'danoStand',
            frames: [ { key: 'dano', frame: 0 } ],
            frameRate: 10,
        });
        this.anims.create({
            key: 'danoUp',
            frames: [ { key: 'dano', frame: 1 } ],
            frameRate: 10,
        });
        this.anims.create({
            key: 'danoDown',
            frames: [ { key: 'dano', frame: 2 } ],
            frameRate: 10,
        });

        // Entrada por flechas del teclado
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    updatePlayerHealth() {
        this.vidaPlayerText.destroy();
        let vidaTexto = 'HP: ' + this.playerLifeSystem.health;
        if (this.playerLifeSystem.nextTimeDamaged < this.game.getTime()){
            this.vidaPlayerText = this.add.text(500, 16, vidaTexto, { fontSize: '50px', fill: '#fff' });
            if (this.danio)
            {
                this.danio.destroy();
                this.danio = null;
            }
        }
        else{
            this.vidaPlayerText = this.add.text(500, 16, vidaTexto, { fontSize: '50px', fill: '#f00' });
            if (!this.danio)
            {
                this.danio = this.add.sprite(this.player.x ,this.player.y,'dano');
            }
        }
        if (this.danio)
            this.danio.setPosition(this.player.x, this.player.y);
            
    }

    update(time) {
        // Las balas que salgan del mapa se borran
        this.bullets.children.iterate((children)=>{
            if(children && children.x > this.canvas.width)
                children.destroy();
        });

        this.superBullets.children.iterate((children)=>{
            if(children && children.x > this.canvas.width)
            {
                children.destroy();
                this.countSuperHits = 0;
            }
        });

        // Think enemies
        if (this.enemies2Count.count < this.enemies2Count.max*2 &&
            this.enemies2.countActive(true) < 10 || this.bossStart && this.enemies2.countActive(true) < 5)
        {
            if (this.nextEnemySpawn <= time)
            {
                let enemy = this.enemies2.create(900, Phaser.Math.Between(50, 550), 'enemy2');
                enemy.setVelocityX(-200)
                this.enemies2Count.count++;
                
                let probSpawn = this.enemies2Count.max - this.enemies2Count.count;
                if (this.enemies2Count.count > this.enemies2Count.max ||
                    Phaser.Math.Between(0, probSpawn) == probSpawn)
                    {
                        enemy.setVelocityY(Phaser.Math.Between(-200,200));
                        enemy.setVelocityX(Phaser.Math.Between(-200, -400))
                    }
                this.nextEnemySpawn = time + Phaser.Math.Between(150, 400)       
            }
        }

        // Think each enemy
        this.enemies2.children.iterate((children)=>{
            if(children && children.y < 31)
            {
                let velocY = Phaser.Math.Between(10,200);
                children.setVelocityY(velocY);
            }

            if(children && children.y > 569)
            {
                let velocY = Phaser.Math.Between(-200,1-0);
                children.setVelocityY(velocY);
            }
            
            if(children && children.x < -20)
                children.destroy();
        });     

        //Think boss
        if (this.enemies2Count.count >= this.enemies2Count.max*2)
        {
            if (this.boss.x > 700)
                this.boss.setVelocityX(-50);
            else if (!this.bossStart){
                this.boss.setVelocityX(0);
                this.boss.setCollideWorldBounds(true);
                this.boss.setVelocityY(200);
                this.vidaText.setText('Vida Jefe: ' + this.vidaBoss);
                this.bossStart = true;
            }

        }
        // Cuando el jefe esta listo para atacar
        if (this.bossStart)
        {
            // Setear primer super disparo
            if (this.bossShootManager.nextSuperShootTime == 0)
                this.bossShootManager.nextSuperShootTime = time + this.bossShootManager.superShootCooldown;
            // Disparo principal
            if (this.bossShootManager.nextSimpleShootTime < time)
            {
                for (let i=0; i<2; i++)
                {
                    let bala = this.enemyBullets.create(this.boss.x-25, this.boss.y+(i==0 ? 1: -1)*50, 'disparoEnemigo');
                    bala.setVelocityX(-400);
                }
                this.bossShootManager.nextSimpleShootTime = this.bossShootManager.simpleShootCooldown + time;
                this.bossShootManager.simpleShootCooldown = Phaser.Math.Between(400,500);
            }
            // Disparo sencundario y potente
            if (this.bossShootManager.nextSuperShootTime < time)
            {
                for (let i=0; i<5; i++)
                {
                    let direccionX = -212.13;
                    let direccionY = 212.13;
                    switch (i){
                        case 0:
                            direccionY *= -1;
                            break;
                        case 1:
                            direccionX = -300;
                            direccionY = 0;
                            break;
                        case 2:
                            direccionX = -260;
                            direccionY = -150;
                            break;
                        case 3:
                            direccionX = -260;
                            direccionY = 150;
                            break;
                        default:
                            
                    }
                    
                    let bala = this.enemyBullets.create(this.boss.x-45, this.boss.y, 'superDisparoEnemigo');
                    bala.setVelocityX(direccionX);
                    bala.setVelocityY(direccionY);
                }
                this.bossShootManager.nextSuperShootTime = this.bossShootManager.superShootCooldown + time;
            }

        }
        this.enemyBullets.children.iterate((children)=>{
            if(children && children.x < 0)
                children.destroy();
        });


        // Movimiento player
        let velocity = 200;

        // Si no se presiona ningun boton, entonces la velocidad es 0
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        this.player.anims.play('stand', true);
        if (this.danio)
            this.danio.anims.play('danoStand', true);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-1*velocity);
        }
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(velocity);
        }
        if (this.cursors.up.isDown){
            this.player.setVelocityY(-1*velocity);
            this.player.anims.play('up', true);
            if (this.danio)
                this.danio.anims.play('danoUp', true);
        }
        if (this.cursors.down.isDown ) {
            this.player.setVelocityY(velocity);
            this.player.anims.play('down', true); 
            if (this.danio)
                this.danio.anims.play('danoDown', true);
        }
        this.updatePlayerHealth();

        // Condiciones de victoria y derrota
        // Victoria
        if(this.vidaBoss <= 0){
            let pasarPuntos = this.puntos;
            this.puntos = 0;
            this.scene.start('ganaste',{puntos:pasarPuntos});
        }
        // Derrota
        if(this.playerLifeSystem.health <= 0){
            let pasarPuntos = this.puntos;
            this.puntos = 0;
            this.scene.start('perdiste',{puntos:pasarPuntos});
        }

    }

}