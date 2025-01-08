const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.getData = async (req,res) =>{
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'})
    }
};

exports.getUser = async (req,res) =>{
    try {
        let user = await User.findById(req.params.id);

        if(!user){
            res.status(500).send('El Usuario no Existe');
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.createUser = async (req, res) => {
    try {
        let user;
        user = new User(req.body);
        await user.save();
        res.send(user)

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.updateUser = async(req, res) =>{
    try {
        const {name, userName, pass,role} = req.body
        let user = await User.findById(req.params.id);
        
        if(!user){
            res.status(500).send('El Usuario no Existe');
        }

        user.name = name;
        user.userName = userName;
        user.pass = pass;
        user.role= role;

        user = await User.findByIdAndUpdate(
            {_id:req.params.id},user,{new: true})
        res.json(user)

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.deleteUser = async (req,res) =>{
    try {
        let user = await User.findById(req.params.id)

        if(!user){
            res.status(500).send('El Usuario no Existe');
        }

        await User.findByIdAndDelete({_id:req.params.id})
        
        res.json({msg : "Usuario Eliminado"});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.signIn = async (req,res) =>{
    const { userName, pass} = req.body;

    try {
        const user = await User.findOne({userName, pass});

        if(user){
            const expiresIn = 18000;

            const token = jwt.sign(user.toJSON(), 'juan', { expiresIn });


            res.json({token, expiresIn})
        }else{
            res.status(401).json({ error: 'Usuario o clave incorrectos'});
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'})
    }
}


exports.test = (req, res) =>{
    if(req.data.role === 'user'){
    res.json('Informacion secreta')
    }else{
        res.json('Bienvenido Admin')
        console.log(req.data);
    }
}