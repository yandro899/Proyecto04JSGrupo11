export class Scenelose extends Phaser.Scene {
    constructor() {
        super({ key: 'perdiste' });
}
}

preload() {
    this.load.image('fondoperdiste', '../../public.img/perdiste.png');
    this.load.image('botonreiniciar', '../../public.img/botonreiniciar.png');
    this.load.image('botonmenu', '../../public.img/botonmenu.png');
}

create() {
    this.add.image(400,150,'fondoperdiste');
    this.botonreiniciar = this.add.image(200,400,'botonreiniciar').setInteractive();
    this.botonreiniciar.on('pointerdown', () =>{
        //cambia a la escena 1
        this.scene.start('Scene1');
    });

    this.botonmenu = this.add.image(600,400,'botonmenu').setInteractive();
    this.botonmenu.on('pointerdown', () =>{
        //cambiar a la escena menu(aun no creada)
        this.scene.start('...');
    });
}


