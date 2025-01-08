const Producto = require('../models/Producto')
const Factura = require('../models/Factura')
const nodemailer = require('nodemailer');


exports.crearProducto = async (req, res) => {
    try {
        let producto;
        producto = new Producto(req.body);
        await producto.save();
        res.send(producto)

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.obtenerProductos = async (req,res) =>{
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}
exports.obtenerProducto = async (req,res) =>{
    try {
        let producto = await Producto.findById(req.params.id);

        if(!producto){
            res.status(500).send('El producto no Existe');
        }
        res.json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.actualizarProducto = async(req, res) =>{
    try {
        const {nombre, categoria, cantidad,stock, precio} = req.body
        let producto = await Producto.findById(req.params.id);
        
        if(!producto){
            res.status(500).send('El producto no Existe');
        }

        producto.nombre = nombre;
        producto.categoria = categoria;
        producto.cantidad = cantidad;
        producto.stock= stock;
        producto.precio = precio;

        producto = await Producto.findByIdAndUpdate(
            {_id:req.params.id},producto,{new: true})
        res.json(producto)

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}


exports.eliminarProducto = async (req,res) =>{
    try {
        let producto = await Producto.findById(req.params.id)

        if(!producto){
            res.status(500).send('El producto no Existe');
        }

        await Producto.findByIdAndDelete({_id:req.params.id})
        
        res.json({msg : "Producto Eliminado"});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }

}

const tls = require('tls');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'siahcoalerts@gmail.com',
        pass: ''
    },    
    tls: {
    rejectUnauthorized: false
    }
});

exports.actualizarStock = async (req,res)=>{
    try {
        const facturas = await Factura.find();
        const productos = await Producto.find();

        for (const factura of facturas){
            const facturaProcesada = await Factura.findById(factura._id)

            if (!facturaProcesada.stockProcesado){
                const productoRelacionado = productos.find(producto => producto.nombre === factura.productoF)
            
                if(productoRelacionado){
                    productoRelacionado.cantidad -= factura.cantidades;

                    if (productoRelacionado.cantidad <= productoRelacionado.stock) {
                        
                        const mailOptions = {
                            from: 'siahcoalerts@gmail.com',
                            to: 'siahcooficcial@gmail.com', 
                            subject: 'Alerta de Stock',
                            text: `¡Alerta! El stock del producto ${productoRelacionado.nombre} está por debajo del límite, su cantidad actual es de ${productoRelacionado.cantidad}.`
                        };
    
                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Correo electrónico enviado: ' + info.response);
                            }
                        });
                    }

                    await facturaProcesada.updateOne({stockProcesado: true})
                }
            }
        }

        await Promise.all(productos.map(producto => producto.save()))


        res.json({ message: 'Stocks actualizados correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}