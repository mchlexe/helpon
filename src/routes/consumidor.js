
const { Router } = require('express')
const router = Router()

const consumidorController = require('../controller/consumidorController')

router.get('/Adicionar', consumidorController.inserirUsuario)
router.get('/Remover', consumidorController.removerUsuario)
router.get('/Atualizar', consumidorController.atualizarUsuario)
router.get('/Pesquisar', consumidorController.pesquisarUsuario)


module.exports = router;
