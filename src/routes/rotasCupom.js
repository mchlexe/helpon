
const { Router } = require('express')
const router = Router()

const cupomController = require('../controller/cupomController')

router.post('/inserir', cupomController.inserirCupom)
router.put('/atualizar', cupomController.atualizarCupom)
router.get('/listar/', cupomController.listarCupons)
router.get('/listarPorStatus/:status', cupomController.listarPorStatusCupons)
router.get('/listar/:id', cupomController.listarCupom)




module.exports = router;
