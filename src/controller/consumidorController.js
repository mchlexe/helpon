
const Usuario = require('../models/Usuario')

const pesquisarUsuario = (req, res) => {
    Usuario.findOne({cpfCnpj: req.body.cpf},
    function (err, user) {
        if (err) return res.send(500, {error: err});
        if (user) {
            return res.send(user);
        }
    }
    )
}

const inserirUsuario = (req, res) => {

    const novoConsumidor = {
        cpfCnpj: req.body.cpf,
        nome: req.body.nome,
        telefone: req.body.telefone,
        email: req.body.email,
        senha: req.body.senha,
        tipo: 'Consumidor'
    }

    new Usuario(novoConsumidor)
        .save()
        .then(() => {
            res.status(200).json({message: 'Usuário inserido com sucesso !'})
        })
        .catch((err) => {
            res.status(400).json({
                erro: err
            })
        })

}

const removerUsuario = (req, res) => {

    Usuario.remove({cpfCnpj: req.body.cpf})
    .then(() => {
        res.status(200).json({message: 'Usuário removido com sucesso !'})
    })
    .catch((err) => {
        res.status(400).json({
            erro: err
        })
    })
}

const atualizarUsuario = (req, res) => {


    Usuario.findOneAndUpdate({cpfCnpj: req.body.cpf}, req.body, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.send('Succesfully saved.');
    });
}


module.exports = {
    inserirUsuario,
    removerUsuario,
    atualizarUsuario,
    pesquisarUsuario
}
