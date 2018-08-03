//Importacion de librerias
//import { Application } from 'express'
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require("body-parser")
//
//const app : Application  = express()
const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
  });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const appRoutes = require("./routes/app")
const usuarioRoutes = require("./routes/usuario")
const loginRoutes = require("./routes/login")
const hospitalRoutes = require("./routes/hospital")
const medicosRoutes = require("./routes/medico")
const busquedaRoutes = require("./routes/busqueda")
const uploadRoutes = require("./routes/upload")
const imagenesRoutes = require("./routes/imagenes")

//conexion a la base de dato
mongoose.connection.openUri(
    "mongodb://localhost:27017/hospitalDB", 
    {useNewUrlParser:  true}, 
    (err, res) => { if ( err ) throw err;
        console.log(`Database:`, 'online');})

//configurando para mostrar la ruta de las imagenes
//var serveIndex = require('serve-index')
//app.use(express.static(__dirname + "/"))
//app.use("/uploads", serveIndex(__dirname + "/uploads"))


//definiendo rutas
app.use("/usuario", usuarioRoutes)
app.use("/login", loginRoutes)
app.use("/hospital", hospitalRoutes)
app.use("/medico", medicosRoutes)
app.use("/busqueda", busquedaRoutes)
app.use("/upload", uploadRoutes)
app.use("/img", imagenesRoutes)


app.use("/", appRoutes)

//escuchar peticiones

app.listen(3000, ()=> {
    console.log('Servidor escuchando en el :\x1b[32m%s\x1b[0m', '3000')
})