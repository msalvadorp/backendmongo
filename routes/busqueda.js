var express = require('express')

const app = express()

const Hospital = require("../models/hospital")

app.get("/todo/:busqueda", (req, res)=>{

    const busqueda = req.params.busqueda

    let regex = new RegExp(busqueda, "i")
    
    Hospital.find({nombre: regex}, (err, hospitales) => {


        res.status(200).json({
            ok : true,
            hospitales
    
        })
    })

    
})

module.exports = app