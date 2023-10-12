export class Menu extends Phaser.Scene{

    constructor() 
    {
      super({ key: 'menu' });
    }

    preload() {
        this.load.image('fondo', '../public/img/fondo-cielo.png');
        this.load.image('botonJugar', '../public/img/boton.png');
        this.load.spritesheet('nave','../public/img/nave.png',{frameWidth:70,frameHeight:62});
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
  
        const nave = this.physics.add.image(400, 100, 'nave');
        nave.setVelocity(100, 200);
        nave.setBounce(1, 1);
        nave.setCollideWorldBounds(true);
  
        particles.startFollow(nave);
    
        const nave2 = this.physics.add.image(100, 400, 'nave');
        nave2.setVelocity(200, 100);
        nave2.setBounce(1, 1);
        nave2.setCollideWorldBounds(true);
  
        const nave3 = this.physics.add.image(700, 400, 'nave');
        nave3.setVelocity(200, 100);
        nave3.setBounce(1, 1);
        nave3.setCollideWorldBounds(true);
  
        //botonsito
        this.botoninicio = this.add.image(400,375,'botonJugar').setInteractive();
        this.botoninicio.on('pointerdown', 
        
        () =>{ console.log("hola");

          //nombre de la siguiente escena
          this.scene.start('Scene1');
        });
    }
  
}