
async function enviaMensagem(sqs, queueURL) {
    const params = defineParametros(queueURL);

    await sqs.sendMessage(params, (err, info) => {
        if (err) {
            console.log('Erro ao enviar mensagem!');
            console.log(err, err.stack);
        } else {
            console.log('Mensagem enviada com sucesso!');
            console.log(info);
        }
    });
}

async function enviaPoisonMessage(sqs, queueURL) {
    const params = defineParametrosPoison(queueURL);
    console.log('Enviando Poison Message no formato XML para a fila...');
    await sqs.sendMessage(params, (err, info) => {
        if (err) {
            console.log('Erro ao enviar poison!');
            console.log(err, err.stack);
        } else {
            console.log('Poison enviado com sucesso!');
            console.log(info);
        }
    });
}

function defineParametros(queueURL) {
    const params = {
        MessageBody: JSON.stringify({
            produtos: [
                { produto: 'livro1', valor: 10},
                { produto: 'livro2', valor: 20},
                { produto: 'caneca1', valor: 13},
            ],
            cliente: 1,
            moeda: 'BRL',
            pagamento: {
                'forma': 'crédito',
                'parcelas': 3
            }
        }),
        QueueUrl: queueURL
    };

    return params;
}

function defineParametrosPoison(queueURL) {
    const params = {
        MessageBody: `
            <produtos>
                <produto>livro1</produto>
                <valor>10</valor>
                <produto>livro2</produto>
                <valor>20</valor>
                <produto>caneca1</produto>
                <valor>13</valor>
            </produtos>
            <cliente>
                1
            </cliente
            <moeda>
                'BRL'
            </moeda>
            <paramento>
                <forma>crédito</forma>
                <parcelas>3</parcelas>
            </pagamento>
        `,
        QueueUrl: queueURL
    };

    return params;
}

module.exports = {
    enviaMensagem,
    enviaPoisonMessage
}
