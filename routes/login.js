var express = require('express')
var bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

var SEED = require("../config/config").SEED
const app = express()

const Usuario = require("../models/usuario")
//bcrypt.compareSync(myPlaintextPassword, hash)

app.post("/", (req, res)=>{

    const body = req.body

    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
        if (err) {
          
            return res.status(500).json({
                ok : false,
                mensaje: "Error al intentar autenticar el usuario",
                errores: err
        
            })
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok : false,
                mensaje: "Credenciales incorrectar - EMAIL" 
            })
        }

        
        if (!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok : false,
                mensaje: "Credenciales incorrectar - PASSWORD" 
            })
        }

        usuarioDB.password = ":)"
        //token
        const token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400})

        res.status(200).json({
            ok : true,
            token: token,
            usuario: usuarioDB._id
    
        })

    })
    
  

})

module.exports = app