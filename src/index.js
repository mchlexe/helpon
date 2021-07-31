require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('./database/conexao')
const rotasConsumidor = require('./routes/consumidor')

app.use(express.json()) //Habilitando o uso de arquivos no formato JSON

//Rotar relacionadas ao usuários consumidor 
app.use('/Consumidor', rotasConsumidor) // -> /Consumidor é o prefixo da rota


app.listen(
    3000,
    () => console.log('Server is running on URL http://localhost:3000')
)