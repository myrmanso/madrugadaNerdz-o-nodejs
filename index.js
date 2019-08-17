const express = require('express');
const bodyParser = require('body-parser');
const MongoCliente = require('mongodb').MongoClient
const joi = require('joi');

const casaSchema = require('./schemas/casa')

const stringDeConexao = "mongodb://galera:nerdzao123@ds021984.mlab.com:21984/got-nerdzao";

//Aplicação devolve as casa do GoT
async function main() {
    const garçom = express();

    garçom.use(bodyParser.json())

    const cliente = new MongoCliente(stringDeConexao, {
        useNewUrlParser: true
    });

    await cliente.connect();
    const db = cliente.db("got-nerdzao");
    const colecaoCasas = db.collection("casas");

    garçom.get("/casas", async (req, res) => {
        const casas = await colecaoCasas.find({}).toArray();
        res.send(
            [
                {
                    nome: "Stark",
                    região: "Norte"
                },
                {
                    nome: "Lannister",
                    região: "Noroeste"
                },
                {
                    nome: "Martell",
                    região: "Sul"
                }
            ]
        );
    });

    /*async = função assincrona*/
    garçom.post("/casas", async (req, res) => {
        const novaCasa = req.body;

        const resultadoDaValidacao = joi.validate(novaCasa, casaSchema);

        if (resultadoDaValidacao.error != null) {
            res.status(400);
            res.send({
                error: resultadoDaValidacao.error.details[0].message
            });
            return;
        }

        //espaçamento - console.log(`novaCasa: ${JSON.stringify(novaCasa, null, 2)}`)

        /*await = para o funcionamento nessa linha até a função assincrona funcionar */
        const result = await colecaoCassas.insertOne(novaCasa);
        res.status(201).send(result.ops[0]);
        /*res = maneira de conversar com o cliente*/
        res.send(result.ops[0])

    });
    garçom.listen(2000, () => console.log("Servidor rodando..."));

}

main();