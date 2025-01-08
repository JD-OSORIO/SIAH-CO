const express = require('express')
const router = express.Router()
const reporteController = require('../controllers/reporteController')

router.post('/', reporteController.createReporte);
router.get('/', reporteController.getReportes);
router.get('/:id', reporteController.getReporte);
router.delete('/:id', reporteController.deleteReporte);

module.exports = router;