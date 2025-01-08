const Factura = require('../models/Factura')
const Producto = require('../models/Producto')
const nodemailer = require('nodemailer');
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


exports.crearFactura = async (req, res) => {
    try {
        const { productoF, cantidades } = req.body;

        const productoRelacionado = await Producto.findOne({ nombre: productoF });
        if (!productoRelacionado || cantidades > productoRelacionado.cantidad) {
            return res.status(400).json({ error: 'La cantidad solicitada excede la cantidad disponible del producto' });
        }else{
            let factura;
            factura = new Factura(req.body);
            const iva = 0.19;
            const operacion = productoRelacionado.precio * cantidades;
            const operacion2 = operacion * iva;
            const suma = operacion + operacion2;
            factura.price = suma;
            await factura.save();

            if (productoRelacionado.cantidad <= productoRelacionado.stock) {
                const mailOptions = {
                    from: 'siahcoalerts@gmail.com',
                    to: 'siahcooficcial@gmail.com', 
                    subject: 'Alerta de Stock',
                    text: `¡Alerta! El stock del producto ${productoF} está por debajo del límite, su cantidad actual es de ${productoRelacionado.cantidad}.`
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Correo electrónico enviado: ' + info.response);
                    }
                });
            }

            res.send(factura)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.obtenerFacturas = async (req,res) =>{
    try {
        const facturas = await Factura.find();
        res.json(facturas);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}
exports.obtenerFactura = async (req,res) =>{
    try {
        let factura = await Factura.findById(req.params.id);

        if(!factura){
            res.status(500).send('La factura no Existe');
        }
        res.json(factura);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.actualizarFactura = async(req, res) =>{
    try {
        const {tipocliente, nombre, telefono, direccion, productoF, cantidades, price} = req.body
        let factura = await Factura.findById(req.params.id);
        
        if(!factura){
            res.status(500).send('La Factura no Existe');
        }
        factura.tipocliente= tipocliente;
        factura.nombre = nombre;
        factura.telefono = telefono;
        factura.direccion = direccion;
        factura.productoF = productoF;
        factura.cantidades = cantidades;
        factura. price = price;

        factura = await Factura.findByIdAndUpdate(
            {_id:req.params.id},factura,{new: true})
        res.json(factura)

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.eliminarFactura = async (req,res) =>{
    try {
        let factura = await Factura.findById(req.params.id)

        if(!factura){
            res.status(500).send('La Factura no Existe');
        }

        await Factura.findByIdAndDelete({_id:req.params.id})
        
        res.json({msg : "Factura Eliminada"});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}