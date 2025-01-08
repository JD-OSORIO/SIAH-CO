const Categoria = require("../models/Categoria");




exports.createCategoria = async (req, res) => {
    try {
        let categoria;
        categoria = new Categoria(req.body);
        await categoria.save();
        res.send(categoria)

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.getCategoria = async (req,res) =>{
    try {
        let categoria = await Categoria.findById(req.params.id);

        if(!categoria){
            res.status(500).send('La Categoria no Existe');
        }
        res.json(categoria);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.getCategorias = async (req,res) =>{
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.deleteCategoria = async (req,res) =>{
    try {
        let categoria = await Categoria.findById(req.params.id)

        if(!categoria){
            res.status(500).send('La categoria no Existe');
        }

        await Categoria.findByIdAndDelete({_id:req.params.id})
        
        res.json({msg : "Categoria Eliminado"});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}
