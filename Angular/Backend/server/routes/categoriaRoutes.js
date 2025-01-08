const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')

router.post('/', categoriaController.createCategoria);
router.get('/', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoria);
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;