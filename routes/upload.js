var express = require('express')
const fileUpload = require('express-fileupload');

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
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension } `
    let ruta = `./uploads/${ tipo }/${ nombreArchivo}`

    archivo.mv(ruta, (err) =>{

        if(err) {
            return res.status(500).json({
                ok : false,
                mensaje : "Error al mover el archivo",
                errors: err
            })
        }

        return res.status(200).json({
            ok : true,
            archivo: archivo.name,
            extension: extension,
            nombreArchivo
        })
    })
    
  });

module.exports = app