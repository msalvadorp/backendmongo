var express = require('express')

const app = express()

app.get("/", (req, res, next)=>{
    res.status(200).json({
        ok : true,
        mensaje : "Dato correcto corregido 3"

    })
})

module.exports = app