
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

function defineParametros(queueURL) {
    params = {
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
    }

    return params;
}

module.exports = {
    enviaMensagem
}
