var express = require('express')

const app = express()

const Hospital = require("../models/hospital")
const Medico = require("../models/medico")
const Usuario = require("../models/usuario")

tablas = [
    "hospital", "usuario", "medico"
]

app.get("/coleccion/:tabla/:busqueda", (req, res) =>{
    const busqueda = req.params.busqueda
    const tabla = req.params.tabla
    let regex = new RegExp(busqueda, "i")

    if (tablas.indexOf(tabla) <0 ){
        return res.status(400).json({
            ok : false,
            error: {message:  "Tabla no valida"}
        })
    }

    let promesa

    switch (tabla) {
        case "usuario":
            promesa = buscarUsuarios(regex)
            break;
        case "hospital":
            promesa = buscarHospitales(regex)
        break;
        case "medico":
            promesa = buscarMedicos(regex)
        break;
    }

    promesa.then(resultado =>{
        return res.status(200).json({
            ok : true, 
            [tabla] : resultado 
        })
    }).catch(error => {
        return res.status(500).json({
            ok : false, 
            errores : error 
        })
    })
    

})

app.get("/todo/:busqueda", (req, res)=>{

    const busqueda = req.params.busqueda

    let regex = new RegExp(busqueda, "i")
    
    Promise.all([
        buscarHospitales(regex), 
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ])
    .then((resp) =>{
        return res.status(200).json({
            ok : true,
            hospitales: resp[0],
            medicos: resp[1],
            usuarios: resp[2]
        })
    })
    .catch((error) =>{
        return res.status(500).json({
            ok : false,
            error: error
        })
    })
})

function buscarHospitales(regex){

    return new Promise((resolve, reject) =>{
        Hospital.find({nombre: regex})
        .populate("usuario", "nombre apellido email")
        .exec((err, hospitales) => {

            if(err){
                reject("Error al buscar en hospitales", err)
            }
            else {
                resolve(hospitales)
            }
        })
    })

}

function buscarMedicos(regex){
    return new Promise((resolve, reject) => {

        Medico.find({nombre : regex})
            .populate("usuario", "nombre apellido email")
            .populate("hospital", "nombre")
            .exec((err, medicos) => {

            if(err){
                reject(err)
            }
            else{
                resolve(medicos)
            }
        })

    })
}

function buscarUsuarios(regex){
    return new Promise((resolve, reject) => {

        Usuario.find({}, "nombre apellido apellido role")
        .or([{"nombre" : regex}, 
            {"apellido": regex}, 
            {"email": regex}])
            .exec((err, usuarios) => {
                if(err){
                    reject(err)
                }
                else{
                    resolve(usuarios)
                }
        })

    })
}

module.exports = app