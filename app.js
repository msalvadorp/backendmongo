//Importacion de librerias
//import { Application } from 'express'
var express = require('express')

var mongoose = require('mongoose')
//
//const app : Application  = express()
const app = express()

//conexion a la base de dato
mongoose.connection.openUri(
    "mongodb://localhost:27017/hospitalDB2", 
    {useNewUrlParser:  true}, 
    (err, res) => { if ( err ) throw err;
        console.log(`Database:`, 'online');})

//definiendo rutas
app.get("/", (req, res, next)=>{
    res.status(200).json({
        ok : true,
        mensaje : "Dato correcto corregido 3"

    })
})


//escuchar peticiones

app.listen(3000, ()=> {
    console.log('Servidor escuchando en el :\x1b[32m%s\x1b[0m', '3000')
})