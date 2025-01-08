const express = require('express')
const router = express.Router()
const productoController = require('../controllers/productoController')

router.post('/', productoController.crearProducto);
router.get('/', productoController.obtenerProductos);
router.get('/:id', productoController.obtenerProducto);
router.put('/:id', productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);
router.post('/actualizarStock', productoController.actualizarStock);

module.exports = router;