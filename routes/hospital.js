var express = require('express')
const app = express()
const autentica = require("../middleware/autenticacion")


const Hospital = require("../models/hospital")

app.get("/", (req, res)=> {

    Hospital.find({}, 
        "nombre img usuario").exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok : false,
                    mensaje : "Error cargando ls hospitales",
                    errors: error
                })
            }

            res.status(200).json({
                ok : true,
                usuarios
            })
            
        })
})

app.post("/", autentica.verificaToken, (req, res) => {

    const body = req.body
    const usuarioToken = req.usuario

    const hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: usuarioToken._id

    })

    hospital.save((err, usuarioGrabado) => {
        if (err) {
            return res.status(400).json({
                ok : false,
                mensaje: "Error al grabar el hospital",
                errores: err
            })
        } 

        return res.status(201).json({
            ok : true,
            hospital
        })

    })
})

app.put("/:id", autentica.verificaToken, (req, res) => {
    const id = req.params.id
    const body = req.body

    Hospital.findById(id, (err, hospitalDB) => {
        
        if(err){
            return res.status(500).json({
                ok : false,
                mensaje : "Error al recuperar el usuario",
                errors: error
            })
        }

        if(!hospitalDB){
            return res.status(400).json({
                ok : false,
                mensaje : "No se encontro el hospital"
            })
        }

        hospitalDB.nombre = body.nombre
        hospitalDB.usuario = req.usuario._id

        hospitalDB.save((err, usuarioGrabado) => {
            if(err){
                return res.status(400).json({
                    ok : false,
                    mensaje : "No se pudo actualizar el hospital",
                    errores: err
                })

            }
            

            return res.status(200).json({
                ok : true,
                hospital: usuarioGrabado
            })
        
        })

    })

})


module.exports = app