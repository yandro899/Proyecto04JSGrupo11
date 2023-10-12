import {  Menu  } from "./scenes/menu.js";
import { Scene1 } from "./scenes/scene1.js";
import { Scene2 } from "./scenes/scene2.js";

let config ={
    type: Phaser.CANVAS,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "thegame",
        width: 800,
        height: 600
    },

            physics:{
                default:'arcade',
                arcade: { gravity:{y:0} }
            },

    //aqui agregar sus escenas
    scene:[Menu, Scene1, Scene2]

}
let game = new Phaser.Game(config);