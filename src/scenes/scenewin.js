export class Scenewin extends Phaser.Scene {
    constructor() {
        super({ key: 'ganaste' });
    }

    init(data) {
        if (data.puntos != undefined)
            this.puntos = data.puntos;
        else
            this.puntos = -1;
    }


    preload() {
        this.load.image('fondoganaste', '../../public/img/ganaste.png');
        this.load.image('botonmenu', '../../public/img/botonmenu.png');
    }

    create() {
        this.add.image(400,300,'fondoganaste');
        let texto = 'Puntuacion: ' + this.puntos;
        this.puntuacionTxt = this.add.text(350, 250, texto, { font: '"Press Start 2P"', color: '#fff'});
        this.puntuacionTxt.scale = 2;
        this.botonmenu = this.add.image(400,400,'botonmenu').setInteractive();
        this.botonmenu.on('pointerdown', () =>{
            //cambiar a la escena menu(aun no creada)
            this.scene.start('menu');
        });
    }
}