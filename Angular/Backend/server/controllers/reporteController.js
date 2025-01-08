const Reporte = require('../models/Reporte')



exports.createReporte = async (req, res) => {
    try {
        let reporte;
        reporte = new Reporte(req.body);
        await reporte.save();
        res.send(reporte)

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.getReporte = async (req,res) =>{
    try {
        let reporte = await Reporte.findById(req.params.id);

        if(!reporte){
            res.status(500).send('El producto no Existe');
        }
        res.json(reporte);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.getReportes = async (req,res) =>{
    try {
        const reportes = await Reporte.find();
        res.json(reportes);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.deleteReporte = async (req,res) =>{
    try {
        let reporte = await Reporte.findById(req.params.id)

        if(!reporte){
            res.status(500).send('El producto no Existe');
        }

        await Reporte.findByIdAndDelete({_id:req.params.id})
        
        res.json({msg : "Producto Eliminado"});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }

}