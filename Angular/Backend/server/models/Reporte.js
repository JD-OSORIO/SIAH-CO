const mongoose = require('mongoose')

const reporteSchema = mongoose.Schema({
    title: {
        type:String,
        require: true
    },
    name: {
        type:String,
        require: true
    },
    text: {
        type:String,
        require: true
    },
    fechaCreacion: {
        type:Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Reporte', reporteSchema)