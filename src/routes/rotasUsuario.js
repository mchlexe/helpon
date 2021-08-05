
const { Router } = require('express')
const router = Router()

const usuarioController = require('../controller/usuarioController')

router.post('/adicionar', usuarioController.inserirUsuario)
router.delete('/remover', usuarioController.removerUsuario)
router.put('/atualizar', usuarioController.atualizarUsuario)

module.exports = router;
