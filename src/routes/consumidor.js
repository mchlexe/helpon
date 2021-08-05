
const { Router } = require('express')
const router = Router()

const consumidorController = require('../controller/consumidorController')

router.post('/Adicionar', consumidorController.inserirUsuario)
router.delete('/Remover', consumidorController.removerUsuario)
router.put('/Atualizar', consumidorController.atualizarUsuario)

module.exports = router;
