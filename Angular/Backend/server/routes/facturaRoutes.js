const express = require('express')
const router = express.Router()
const facturaController = require('../controllers/facturaControllers')

router.post('/', facturaController.crearFactura);
router.get('/', facturaController.obtenerFacturas);
router.get('/:id', facturaController.obtenerFactura);
router.put('/:id', facturaController.actualizarFactura);
router.delete('/:id', facturaController.eliminarFactura);

module.exports = router;