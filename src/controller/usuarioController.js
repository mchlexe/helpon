
const { response } = require('express')
const Usuario = require('../models/Usuario')
const Cupom = require('../models/Cupom')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const SECRET = 'helpontolls'
const yup = require('yup')
const axios = require('axios').default
const { unlink } = require('fs') //Metodo que remove arquivos
const { join } = require('path')

let schema = yup.object().shape({
    cpfCnpj: yup.string().required(),
    fotoPerfil: yup.string().required(),
    nome: yup.string().required(),
    telefone: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string().required(),
    tipo: yup.string().required()
})


const deletarImagem = (nomeDoArquivo) => {

    const caminhoImagem = join(__dirname, '../../uploads', nomeDoArquivo)

    unlink(caminhoImagem, (err) => {
        if (err) throw err;
        console.log(`A imagem foi apagada com sucesso !`)
    })

}

const inserirUsuario = (req, res) => {

    schema.isValid({
        cpfCnpj: req.body.cpfCnpj,
        fotoPerfil: (req.file) ? `http://localhost:3000/uploads/${req.file.filename}` : 'http://localhost:3000/uploads/userDefaultImage.jpg',
        nome: req.body.nome,
        telefone: req.body.telefone,
        email: req.body.email,
        senha: req.body.senha,
        tipo: req.body.tipo
    }).then(function (valid) {
        if(valid){
    Usuario.findOne({ cpfCnpj: req.body.cpfCnpj })
        .then((user, err) => {

            if (user) {

                res.status(400).json({ message: 'CPF/CNPJ já cadastrado!' })
                //Deletando a imagem que foi salva:
                deletarImagem(req.file.filename)

            }

            else {

                const hash = bcrypt.hashSync(req.body.senha, 10);
                //await hashPassword(req.body.senha)

                let novoUsuario = {
                    cpfCnpj: req.body.cpfCnpj,
                    fotoPerfil: (req.file) ? `http://localhost:3000/uploads/${req.file.filename}` : 'http://localhost:3000/uploads/userDefaultImage.jpg',
                    nome: req.body.nome,
                    telefone: req.body.telefone,
                    email: req.body.email,
                    senha: hash,
                    tipo: req.body.tipo
                }

                if ( ['Comércio', 'Instituição'].includes(req.body.tipo) ) {

                    //campos de endereço
                    novoUsuario['cidade'] = ''
                    novoUsuario['uf'] = ''
                    novoUsuario['bairro'] = ''
                    novoUsuario['rua'] = ''
                    novoUsuario['numero'] = ''
                    novoUsuario['complemento'] = ''
                    novoUsuario['latitude'] = ''
                    novoUsuario['longitude'] = ''

                    if ( req.body.tipo == 'Instituição' ) {
                        novoUsuario['descricao'] =  ''
                    }

                    if ( req.body.tipo == 'Comércio' ) {
                        novoUsuario['ramo'] = ''
                    }
                }

                new Usuario(novoUsuario)
                    .save()
                    .then(() => {
                        res.status(200).json({ message: 'Usuário inserido com sucesso !' })
                    })
                    .catch((err) => {

                        //Apagando a imagem 
                        deletarImagem(req.file.filename)

                        res.status(400).json({
                            erro: err
                        })
                    })
            }
        })
        .catch((err) => {
            res.status(400).json({
                erro: err
            })
        })
    }else{
        res.send("Preencha todo o formulário")
    }
})
}


const removerUsuario = (req, res) => {

    Usuario.findOne({ cpfCnpj: req.body.cpfCnpj })
        .then((user, err) => {

            if (user) {

                Usuario.deleteOne({ cpfCnpj: req.body.cpfCnpj })
                    .then(() => {
                        res.status(200).json({ message: 'Usuario deletado com sucesso!' })
                    })
                    .catch((err) => {
                        res.status(400).json({ message: 'Falha interna ao deletar o usuario!' })
                    })

            } else {
                res.status(404).json({ message: 'Usuário não encontrado!' })
            }

        }).catch((err) => {
            res.status(500).json(
                {
                    message: 'Falha interna ao procurar o usuario!',
                    erro: err
                }
            )
        })

}


const atualizarUsuario = (req, res) => {
<<<<<<< HEAD

=======
>>>>>>> aa44600626b4ad573b94b720c69483ce9a625bf1
    Usuario.findOne({ cpfCnpj: req.body.cpfCnpj })
        .then((user, err) => {

            if (user) {

                if(req.body['cupons']){
                    // comprar
                    // {
                    //     "cpfCnpj": "12312",
                    //     "cupons": {"id": 12,"status": true}
                    // }
                    // { utilizar
                    //     "cpfCnpj": "12312",
                    //     "cupons": {"id": 12,"status": true}
                    // }
                    user['cupons'].forEach((element) => {
                        if (element['id'] == req.body['cupons'].id) {
                            if (req.body['cupons'].status == false) {
                                element['status'] = false
                                req.body['cupons'] = ''
                            } else {
                                err = {"400": "Usuário já comprou cupom"};
                                throw err;
                            }
                        }
                        else {
                        }
                     })

                    string_cupons = user['cupons'].concat(req.body['cupons'])
                    req.body['cupons'] = string_cupons
                }

                Usuario.updateOne({ cpfCnpj: req.body.cpfCnpj }, req.body)
                    .then(() => {
                        res.status(200).json({ message: 'Usuario atualizado com sucesso!' });
                        return user;
                    })
                    .catch((err) => {
                        res.status(500).json({ message: 'Falha interna ao atualizar o usuario!' });
                    })

            } else {
                res.status(404).json({ message: 'Usuário não encontrado!' });
            }

        }).catch((err) => {
            res.status(500).json(
                {
                    erro: err,
                    message: 'Falha interna ao procurar o usuario!',
                }
            )
        })
}

const listarUsuarios = (req, res) => {
    //parte para verificar a autenticidade do token
    const token = req.headers['x-access-token'];

    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) return res.status(401).json({ message: 'Token inválido' }).end;

        req.userId = decoded.userId;
    })
    Usuario.find(req.body).lean()
        .then((usuarios) => {
            return res.end(JSON.stringify(usuarios))
        }).catch((err) => {
            rest.status(500).json({
                erro: err,
                message: 'Falha interna ao procurar usuários!'
            })
        })
}

const loginUsuarios =(req, res) =>{
    const login = {
        email: req.body.email,
        senha: req.body.senha,
    }
    Usuario.findOne({email: req.body.email })
        .then((user) => {
            //bcrypt.compareSync(password, hash);
            //login.senha == user.senha
           if (bcrypt.compareSync(login.senha, user.senha)){
               const token = jwt.sign({userId: user._id}, SECRET, { expiresIn:14400})
               return res.json({auth: true, token});
            }
            else{
                res.status(401).json({ message: 'Senha incorreta!' });
            }
        }
        ).catch((err) => {
            res.status(500).json({
                erro: err,
                message: 'Email não cadastrado!'
            })
        })

}

//Função para recuperar as coordenadas de um usuário com base no seu endereço
const getCoordenadas = async (numero, rua, cidade, uf) => {

    try {

        const { data } = await axios.get(
            `https://nominatim.openstreetmap.org/search`,
            {
                params: {
                    street: `${numero} ${rua}`,
                    city: cidade,
                    state: uf,
                    country: 'Brasil',
                    countrycodes: 'br',
                    format: 'json',
                    limit: 1
                }
            }
        )

        if (data) { //Se o endereço for localizado, retona as coordenadas, se não, retorna um array vazio
            return (data.length > 0) ? [data[0].lat, data[0].lon] : []
        }

    } catch(err) {
        throw err;
    }

}

//Rota para atribuir as informações sobre do localização usuário
const atribuirCoordenadas = async (req, res) => {

    const user = await Usuario.findOne({cpfCnpj: req.body.cpfCnpj});

    if ( user && ['Instituição', 'Comércio'].includes(user.tipo) ) {

        const coordenadas = await getCoordenadas(
            req.body.numero,
            req.body.rua,
            req.body.cidade,
            req.body.uf,
        )

        if ( coordenadas.length > 0 ) { //Verificando se o endereço foi passado corretamente

            user.cidade = req.body.cidade;
            user.uf = req.body.uf;
            user.bairro = req.body.bairro;
            user.rua = req.body.rua;
            user.numero = req.body.numero;
            user.complemento = req.body.complemento;
            user.latitude = coordenadas[0];
            user.longitude = coordenadas[1];

            try {

                await user.save();
                res.status(200).json({message: 'Localização atribuida com sucesso !'})

            } catch (err) {
                res.status(400).json({error: err});
            }

        } else {//Caso o endereço seja invalido:
            res.status(400).json({error: 'Endereço invalido !'})
        }

    } else { //Usuário não encontrado !
        res.status(404).json({error: 'Desculpe, esse usuário não existe ou não é do tipo Comércio ou Instituição !'})
    }

}



module.exports = {
    inserirUsuario,
    removerUsuario,
    atualizarUsuario,
    listarUsuarios,
    loginUsuarios,
    atribuirCoordenadas
}
