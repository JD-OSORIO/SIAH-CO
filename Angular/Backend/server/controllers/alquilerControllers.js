const Alquiler = require('../models/Alquiler')
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

exports.crearAlquiler = async (req, res) => {
    try {
        const { codigoherramienta, diasprestamo, cantidades, deposito} = req.body;

        const productoRelacionado = await Producto.findOne({ nombre: codigoherramienta });
        if(!productoRelacionado || cantidades > productoRelacionado.cantidad){
            return res.status(400).json({ error: 'La cantidad solicitada excede la cantidad disponible del producto'})
        }else{
            let alquiler;
            const valordia = 0.05
            alquiler = new Alquiler(req.body);
            const operacion = productoRelacionado.precio * valordia
            const operacion2= operacion * cantidades;
            const suma = operacion2 * diasprestamo;
            const totaldep = deposito * cantidades;
            const totalpagar = totaldep + suma;
            alquiler.totalPagar = totalpagar;
            alquiler.deposito = totaldep;
            alquiler.total = suma;
            await alquiler.save();
            if (productoRelacionado.cantidad <= productoRelacionado.stock) {
                const mailOptions = {
                    from: 'siahcoalerts@gmail.com',
                    to: 'siahcooficcial@gmail.com', 
                    subject: 'Alerta de Stock',
                    text: `¡Alerta! El stock del producto ${codigoherramienta} está por debajo del límite, su cantidad actual es de ${productoRelacionado.cantidad}.`
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Correo electrónico enviado: ' + info.response);
                    }
                });
            }

            res.send(alquiler)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.obtenerAlquilers = async (req,res) =>{
    try {
        const alquilers = await Alquiler.find();
        res.json(alquilers);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}
exports.obtenerAlquiler = async (req,res) =>{
    try {
        let alquiler = await Alquiler.findById(req.params.id);

        if(!alquiler){
            res.status(500).send('El Alquiler no Existe');
        }
        res.json(alquiler);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.actualizarAlquiler = async(req, res) =>{
    try {
        const {tipocliente,nombre,telefono,direccion, codigoherramienta, diasprestamo, deposito, total} = req.body
        let alquiler = await Alquiler.findById(req.params.id);
        
        if(!alquiler){
            res.status(500).send('El alquiler no Existe');
        }
        alquiler.tipocliente= tipocliente;
        alquiler.nombre= nombre;
        alquiler.telefono=telefono;
        alquiler.direccion=direccion;
        alquiler. codigoherramienta= codigoherramienta;
        alquiler.diasprestamo = diasprestamo;
        alquiler.deposito = deposito;
        alquiler.total = total;

        alquiler = await Alquiler.findByIdAndUpdate(
            {_id:req.params.id},alquiler,{new: true})
        res.json(alquiler)

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.eliminarAlquiler = async (req,res) =>{
    try {
        let alquiler = await Alquiler.findById(req.params.id)

        if(!alquiler){
            res.status(500).send('El alquiler no Existe');
        }

        await Alquiler.findByIdAndDelete({_id:req.params.id})
        
        res.json({msg : "Alquiler Eliminada"});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.actualizarStock = async (req,res)=>{
    try {
        const alquilers = await Alquiler.find();
        const productos = await Producto.find();

        for (const alquiler of alquilers){
            const alquilerProcesado = await Alquiler.findById(alquiler._id)

            if (!alquilerProcesado.stockProcesado){
                const productoRelacionado = productos.find(producto => producto.nombre === alquiler.codigoherramienta)
            
                if(productoRelacionado){
                    productoRelacionado.cantidad -= alquiler.cantidades;

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

                    await alquilerProcesado.updateOne({stockProcesado: true})
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