export class Scenelose extends Phaser.Scene {
    constructor() {
        super({ key: 'perdiste' });
    }

    init(data) {
        if (data.puntos != undefined)
            this.puntos = data.puntos;
        else
            this.puntos = -1;
    }

    preload() {
        this.load.image('fondoperdiste', '../../public/img/perdiste.png');
        this.load.image('botonreiniciar', '../../public/img/botonreiniciar.png');
        this.load.image('botonmenu', '../../public/img/botonmenu.png');
    }

    create() {
        this.add.image(400,300,'fondoperdiste');
        let texto = 'Puntuacion: ' + this.puntos;
        this.puntuacionTxt = this.add.text(350, 250, texto, { font: '"Press Start 2P"', color: '#fff'});
        this.puntuacionTxt.scale = 2;
        this.botonreiniciar = this.add.image(200,400,'botonreiniciar').setInteractive();
        this.botonreiniciar.on('pointerdown', () =>{
            //cambia a la escena 1
            //this.scene.start('Scene1');
            this.scene.start('Scene2');
        });

        this.botonmenu = this.add.image(600,400,'botonmenu').setInteractive();
        this.botonmenu.on('pointerdown', () =>{
            //cambiar a la escena menu(aun no creada)
            this.scene.start('...');
        });
    }
}

