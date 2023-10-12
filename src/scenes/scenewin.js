export class Scenewin extends Phaser.Scene {
    constructor() {
        super({ key: 'ganaste' });
}
}

preload() {
    this.load.image('fondoganaste', '../../public.img/ganaste.png');
    this.load.image('botonmenu', '../../public.img/botonmenu.png');
}

create() {
    this.add.image(400,150,'fondoganaste');
    this.botonmenu = this.add.image(400,400,'botonmenu').setInteractive();
    this.botonmenu.on('pointerdown', () =>{
        //cambiar a la escena menu(aun no creada)
        this.scene.start('...');
    });
    }