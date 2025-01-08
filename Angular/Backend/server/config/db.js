const mongoose = require('mongoose')
require('dotenv').config({ path : 'variables.env'});

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.DB_MONGO)
        console.log("Base de Datos Conectada");

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
module.exports = connectDB