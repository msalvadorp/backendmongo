//Importacion de librerias
//import { Application } from 'express'
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require("body-parser")
//
//const app : Application  = express()
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const appRoutes = require("./routes/app")
const usuarioRoutes = require("./routes/usuario")

//conexion a la base de dato
mongoose.connection.openUri(
    "mongodb://localhost:27017/hospitalDB", 
    {useNewUrlParser:  true}, 
    (err, res) => { if ( err ) throw err;
        console.log(`Database:`, 'online');})

//definiendo rutas
app.use("/usuario", usuarioRoutes)
app.use("/", appRoutes)

//escuchar peticiones

app.listen(3000, ()=> {
    console.log('Servidor escuchando en el :\x1b[32m%s\x1b[0m', '3000')
})