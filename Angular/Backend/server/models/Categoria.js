const mongoose = require('mongoose')

const categoriaSchema = mongoose.Schema({
    categoria: {
        type:String,
        require: true
    },
    fechaCreacion: {
        type:Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Categoria', categoriaSchema)