var express = require('express')
const jwt = require("jsonwebtoken")
var SEED = require("../config/config").SEED

const app = express()

exports.verificaToken = function(req, res, next) {
    const token = req.query.token

    if(!token){
        return res.status(400).json({
            ok : false,
            mensaje: "Debe enviar el token" 
        })
    }

    jwt.verify(token, SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok : false,
                mensaje: "Token no valido",
                errores: err
            })
        }
        req.usuario = decoded.usuario
        next()
/*
        return res.status(200).json({
            ok : true,
            mensaje: "ok",
            decoded
        })*/
    })
    

}
