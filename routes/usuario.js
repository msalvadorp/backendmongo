var express = require('express')
var bcrypt = require('bcrypt')

//const jwt = require("jsonwebtoken")
const autentica = require("../middleware/autenticacion")
var SEED = require("../config/config").SEED

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
// Eliminar usuario por ID
// =========
app.delete("/:id", autentica.verificaToken, (req, res)=>{

    const id = req.params.id

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{

        if (err) {
          
            return res.status(500).json({
                ok : false,
                mensaje: "Error al borrar el usuario",
                errores: err
        
            })
        }

        if (!usuarioBorrado){
            return res.status(400).json({
                ok : false,
                mensaje: "No se encontro el usuario con el codigo",
                errores: {message: "No se encontro el usuario"}
        
            })
        }

        usuarioBorrado.password = ":)"
        res.status(200).json({
            ok : true,
            usuario: usuarioBorrado

        })

    })
})
 

// =========
// Actualizar usuario
// =========
app.put("/:id", autentica.verificaToken,  (req, res) =>{
 
    const id = req.params.id
    const body = req.body

    Usuario.findById(id, (err, usuario)=>{
        if (err) {
          
            return res.status(500).json({
                ok : false,
                mensaje: "Error al buscar el usuario",
                errores: err
        
            })
        }

        if (!usuario){
            return res.status(400).json({
                ok : false,
                mensaje: "No se encontro el usuario con el codigo",
                errores: {message: "No se encontro el usuario"}
        
            })
        }

        usuario.nombre = body.nombre
        usuario.apellido = body.apellido
        usuario.email = body.email
        usuario.role = body.role

        usuario.save((err, usuarioGuardado) => {

            if (err){

                return res.status(400).json({
                    ok : false,
                    mensaje: "Error al actualizar el usuario",
                    errores: err
            
                })
             }
             usuarioGuardado.password = ":)"
                res.status(200).json({
                ok : true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
    
            })
        })
        
    })

    
    

})

// =========
// Crear usuario
// =========
app.post("/", autentica.verificaToken, (req, res) =>{
    
    const body = req.body

    var usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })

    usuario.save((err, usuarioGrabado) => {
        if (err) {
            
            return res.status(400).json({
                ok : false,
                mensaje: "Error al grabar el usuario",
                errores: err
        
            })
        } 

        res.status(201).json({
            ok : true,
            usuario: usuarioGrabado,
            usuarioToken: req.usuario
    
        })

    })
   
})


module.exports = app