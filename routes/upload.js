var express = require('express')
const fileUpload = require('express-fileupload');
const fs = require("fs")

const Hospital = require("../models/hospital")
const Medico = require("../models/medico")
const Usuario = require("../models/usuario")

const app = express()

app.use(fileUpload());

app.put('/:tipo/:id', function(req, res) {
    if (!req.files){
        return res.status(400).json({
            ok : false,
            mensaje : "No hay archivo adjunto",
            errors: {message: "Debe seleccionar la imagen"}
        })
    }

    let tipo = req.params.tipo
    let id = req.params.id

    let tiposColleccion = ["hospitales", "medicos", "usuarios"]

    if (tiposColleccion.indexOf(tipo) < 0){
        return res.status(400).json({
            ok : false,
            mensaje : "Tipo de coleccion no valida",
            errors: {message: "Tipo de coleccion no valida"}
        })
    }


    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length -1]
  
    let extensiones = ["jpg", "png", "gif", "jpeg"]

    if (extensiones.indexOf(extension)) {
        return res.status(400).json({
            ok : false,
            mensaje : "Extension no validad",
            errors: {message: "Las extensiones son " + extensiones.join(", ")}
        })

    }
    //nombre archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`
    let ruta = `./uploads/${ tipo }/${ nombreArchivo}`

    archivo.mv(ruta, (err) =>{

        if(err) {
            return res.status(500).json({
                ok : false,
                mensaje : "Error al mover el archivo",
                errors: err
            })
        }

        subirPotTipo(tipo, id, nombreArchivo, res)

       
    })
    
  });

  function eliminarArchivo(carpeta, img){
    let pathViejo = `./uploads/${carpeta}/${img}`
                
    if (fs.existsSync(pathViejo)){
         fs.unlink(pathViejo)
     }
  }

function subirPotTipo(carpeta, id, nombreArchivo, res)
{
    if (carpeta === "usuarios") {

        Usuario.findById(id)
            .exec((err, usuarioBD)=>{
                if(err){
                    return res.status(500).json({
                        ok : false,
                        error: {message:  "Error al consultar el usuario"}
                    })
                }
                eliminarArchivo(carpeta, usuarioBD.img)

                usuarioBD.img = nombreArchivo

                usuarioBD.save((err, usuarioActualizado) =>{
                    if(err){
                        return res.status(500).json({
                            ok : false,
                            mensaje : "No se pudo actualizar el usuario",
                            error: err
                        })
                    }
                    usuarioActualizado.password = ":)"
                    return res.status(200).json({
                        ok : true,
                        usuario: usuarioActualizado
                    })
            
                })

        })
    }

    if (carpeta === "hospitales") {

        Hospital.findById(id)
            .exec((err, hospitalBD)=>{
                if(err){
                    return res.status(500).json({
                        ok : false,
                        error: {message:  "Error al consultar el hospital"}
                    })
                }
                eliminarArchivo(carpeta, hospitalBD.img)

                hospitalBD.img = nombreArchivo

                hospitalBD.save((err, hospitalActualizado) =>{
                    if(err){
                        return res.status(500).json({
                            ok : false,
                            mensaje : "No se pudo actualizar el hospital",
                            error: err
                        })
                    }
                    
                    return res.status(200).json({
                        ok : true,
                        hospital: hospitalActualizado
                    })
            
                })

        })
    }

    if (carpeta === "medicos") {

        Medico.findById(id, (err, medicoBD)=>{
                if(err){
                    return res.status(500).json({
                        ok : false,
                        mensaje: "Error al consultar el medico",
                        error: err
                    })
                }

                if(!medicoBD)
                {
                    return res.status(400).json({
                        ok : false,
                        error: {message:  "Medico no existe"}
                    })
                }

                eliminarArchivo(carpeta, medicoBD.img)

                medicoBD.img = nombreArchivo

                medicoBD.save((err, medicoActualizado) =>{
                    if(err){
                        return res.status(500).json({
                            ok : false,
                            mensaje : "No se pudo actualizar el medico",
                            error: err
                        })
                    }
                    
                    return res.status(200).json({
                        ok : true,
                        medico: medicoActualizado
                    })
            
                })

        })
    }
}

module.exports = app