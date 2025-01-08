const express = require('express')
const router = express.Router()
const alquilerController = require('../controllers/alquilerControllers')

router.post('/', alquilerController.crearAlquiler);
router.get('/', alquilerController.obtenerAlquilers);
router.get('/:id', alquilerController.obtenerAlquiler);
router.put('/:id', alquilerController.actualizarAlquiler);
router.delete('/:id', alquilerController.eliminarAlquiler);
router.post('/actualizarStock', alquilerController.actualizarStock);

module.exports = router;