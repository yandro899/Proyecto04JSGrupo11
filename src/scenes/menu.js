export class Menu extends Phaser.Scene{

    constructor() 
    {
      super({ key: 'menu' });
    }

    preload() {
        this.load.image('fondo', '../public/img/fondo-cielo.png');
        this.load.image('botonJugar', '../public/img/boton.png');
        this.load.spritesheet('nave','../public/img/nave.png',{frameWidth:70,frameHeight:62});
        this.load.spritesheet('naveEnemy','../public/img/enemy2.png',{ frameWidth: 70, frameHeight: 62 });
        this.load.image('fuego', '../public/img/red.png');
      }
    
      create() {
        this.add.image(400,300,'fondo');
    
        //nave rebotando
        //particulas
        const particles = this.add.particles(-30, 10, 'fuego', {
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });
  
        const nave = this.physics.add.image(150, 100, 'nave');
        nave.setVelocity(100, 200);
        nave.setBounce(1, 1);
        nave.setCollideWorldBounds(true);
  
        particles.startFollow(nave);
    
        const naveEnemy = this.physics.add.image(600, 200, 'naveEnemy');
        naveEnemy.setVelocity(200, 100);
        naveEnemy.setBounce(1, 1);
        naveEnemy.setCollideWorldBounds(true);
  
        const naveEnemy2 = this.physics.add.image(700, 300, 'naveEnemy');
        naveEnemy2.setVelocity(200, 100);
        naveEnemy2.setBounce(1, 1);
        naveEnemy2.setCollideWorldBounds(true);

        const naveEnemy3 = this.physics.add.image(500, 400, 'naveEnemy');
        naveEnemy3.setVelocity(200, 100);
        naveEnemy3.setBounce(1, 1);
        naveEnemy3.setCollideWorldBounds(true);
  
        //botonsito
        this.botoninicio = this.add.image(400,375,'botonJugar').setInteractive();
        this.botoninicio.on('pointerdown', 
        
        () =>{ console.log("pium pium");

          //nombre de la siguiente escena
          this.scene.start('Scene1');
        });
    }
  
}