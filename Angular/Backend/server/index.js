const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors')
const app = express();
const port = 4000;

connectDB();

app.use(express.json());
app.use(cors());
app.use('/api/productos',require('./routes/productoRoutes'));
app.use('/api/facturas',require('./routes/facturaRoutes'));
app.use('/api/alquilers',require('./routes/alquilerRoutes'));
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/reportes', require('./routes/reporteRoutes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));

app.listen(port, ()=> {
    console.log("El Servidor Esta Encendido")
})