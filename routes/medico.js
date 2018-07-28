var express = require('express')
const Medico = require("../models/medico")
const autentica = require("../middleware/autenticacion")

const app = new express()


app.get("/", (req, res) => {

    let desde = req.query.desde || 0
    desde = Number(desde)

    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("hospital")
    .exec((err, medicos) => {
        if (err) {
            return res.status(500).json({
                ok : false,
                mensaje : "Error cargando los medicos",
                errors: error
            })
        }

        Medico.count({}, (err, count) =>{

            return res.status(200).json({
                ok : true,
                medicos,
                total: count
            })

        })
       
    })

})


app.post("/", autentica.verificaToken, (req, res) => {

    const body = req.body

    const medicoInserta = new Medico({
        nombre: body.nombre,
        hospital : body.hospital,
        usuario: req.usuario._id
    })

    medicoInserta.save((err, medicoBD) => {
        if (err) {
            return res.status(400).json({
                ok : false,
                mensaje: "Error al grabar el medico",
                errores: err
            })
        } 

        return res.status(201).json({
            ok : true,
            medico: medicoBD
        })
    })
})

app.put("/:id", autentica.verificaToken, (req, res) => {

    const id = req.param.id
    const body = req.body

    Medico.findById(id, (err, medicoBD) => {

        if(err){
            return res.status(500).json({
                ok : false,
                mensaje : "Error al recuperar el medico",
                errors: error
            })
        }

        if(!medicoBD) {
            return res.status(400).json({
                ok : false,
                mensaje : "No se encontro el medico"
            })
        }

        medicoBD.nombre = body.nombre
        medicoBD.medico = body.medico

        medicoBD.save((err, medicoGrabado) => {
            if(err){
                return res.status(400).json({
                    ok : false,
                    mensaje : "Error al grabar el medico",
                    errors: error
                })
            }

            return res.status(200).json({
                ok : true,
                medico: medicoGrabado
            })
        })

    })

})




module.exports = app