const express = require('express');

const app = express();

app.get('/',(req, res) => {
    //res.end('Servidor')
    //console.log(__dirname)asd,
    res.sendFile(__dirname+'/public/index.html')
})

//se agrego para acceder a las rutas
app.use('/public', express.static(__dirname + '/public'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

//configurar server basico
app.listen(5002, function(){
    console.log("El servidor de prueba DESAFIO funciona correctamente.")
});