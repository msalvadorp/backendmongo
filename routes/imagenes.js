var express = require('express')
const fs = require("fs")
const path = require("path")
const app = express()

app.get("/:tipo/:img", (req, res, next)=>{

    //falta agregar las validaciones de la carpeta
    let tipo = req.params.tipo
    let img = req.params.img

    let ruta = `./uploads/${ tipo }/${ img }`
    let pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`)

    if (fs.existsSync(pathImagen)){
        return res.sendFile(pathImagen)
    }
    else {
        let pathNoImage = path.resolve(__dirname, "../assets/no-img.jpg")
        return res.sendFile(pathNoImage)
    }

})

module.exports = app