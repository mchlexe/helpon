
const { Router } = require('express')
const router = Router()

const consumidorController = require('../controller/consumidorController')

router.get('/Adicionar', consumidorController.inserirUsuario)


module.exports = router;