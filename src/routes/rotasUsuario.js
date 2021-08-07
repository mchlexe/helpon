
const { Router } = require('express')
const router = Router()

const usuarioController = require('../controller/usuarioController')

router.post('/inserir', usuarioController.inserirUsuario)
router.delete('/remover', usuarioController.removerUsuario)
router.put('/atualizar', usuarioController.atualizarUsuario)
router.get('/listar', usuarioController.listarUsuarios)

module.exports = router;
