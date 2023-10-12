import { Scene1 } from "./scenes/scene1.js";
import { Scene2 } from "./scenes/scene2.js";
import { Scenewin } from "./scenes/scenewin.js";
import { Scenelose } from "./scenes/scenelose.js";


let config = {
    type: Phaser.CANVAS,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "thegame",
        width: 800,
        height: 600
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    //aqui agregar sus escenas
    scene:[Scene2, Scenelose, Scenewin]
}
let game = new Phaser.Game(config);


