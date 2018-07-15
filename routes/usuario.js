var express = require('express')

const app = express()

const Usuario = require("../models/usuario")

app.get("/", (req, res, next)=>{

    Usuario.find({}, 
        "nombre apellido email img role").exec(
            (error, usuarios)=>{

            if (error) {
                res.status(500).json({
                    ok : false,
                    mensaje : "Error cargando el usuario",
                    errors: error
                })
            }

            res.status(200).json({
                ok : true,
                usuarios: usuarios
        
            })
        

    })

    
})


// =========
// Crear usuario
// =========
app.post("/", (req, res) =>{
    
    const body = req.body

    res.status(200).json({
        ok : true,
        body: body

    })
})


module.exports = app