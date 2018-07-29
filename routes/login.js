var express = require('express')
var bcrypt = require('bcrypt')

//Google
var CLIENT_ID = require("../config/config").CLIENT_ID
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//JWT
const jwt = require("jsonwebtoken")
var SEED = require("../config/config").SEED

const app = express()

const Usuario = require("../models/usuario")


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.given_name,
        apellido: payload.family_name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

app.post("/google", (req, res) =>{
    
    let token = req.body.token
    let googleUser = verify(token)
    .catch(error => {
        return res.status(403).json({
            ok : true,
            mensaje: "Token no valido",
            errores: error
    
        })
    }).then(usuarioGoogle =>{

        Usuario.findOne({email: usuarioGoogle.email}, (err, usuarioDB)=> {
            if(err){
                return res.status(500).json({
                    ok : false,
                    mensaje : "Error al buscar el usuario",
                    errors: err
                })
    
            }

            if(usuarioDB){
                if(usuarioDB.google === false) {
                    return res.status(400).json({
                        ok : false,
                        mensaje : "No puede autenticarse con usuario de google" 
                    })
                }
                else {
                    generaToken(usuarioDB, res)
                }
            }
            else {
                let usuario = new Usuario({
                    nombre : usuarioGoogle.nombre,
                    apellido : usuarioGoogle.apellido,
                    email: usuarioGoogle.email,
                    img: usuarioGoogle.img,
                    google: true,
                    password: ":)"
                })

                usuario.save((err, usuarioGrabado) => {
                    if(err){
                        return res.status(400).json({
                            ok : false,
                            mensaje : "Error al grabar el nuevo usuario",
                            errors: err
                        })
            
                    }

                    generaToken(usuarioGrabado, res)

                })
            }
        })

        
    })

    

})

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
        generaToken(usuarioDB, res)
        /*
        const token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400})

        res.status(200).json({
            ok : true,
            token: token,
            usuario: usuarioDB._id
    
        })
        */
    })
    
  

})


function generaToken(usuarioDB, res){
    const token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400})

    res.status(200).json({
        ok : true,
        token: token,
        usuario: usuarioDB

    })
}

module.exports = app