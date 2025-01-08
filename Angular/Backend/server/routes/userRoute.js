const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken')

router.post('/', userController.createUser);
router.post('/singin', userController.signIn)
//router.post('/singout', verifyToken, userController.signOut)
router.post('/test',verifyToken,userController.test)
router.get('/', userController.getData);
router.get('/:id',userController.getUser);
router.put('/:id',userController.updateUser);
router.delete('/:id',userController.deleteUser);

module.exports = router;