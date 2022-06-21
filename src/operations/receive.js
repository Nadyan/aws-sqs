
async function recebeMensagem(sqs, queueURL) {
    const params = defineParametros(queueURL);
    await sqs.receiveMessage(params, (err, info) => {
        if (err) {
            console.log('Problemas ao receber mensagens!');
            console.log(err, err.stack);
            return;
        } else {
            console.log('Mensagens recebidas');
        
            if (info.Messages) {
                info.Messages.forEach(
                    async mensagem => {
                        try {
                            const body = JSON.parse(mensagem.Body);

                            console.log('Processando mensagem...');
                            console.log(`Venda para o cliente ${body.cliente} recebida:`);
                            console.log(body);
                            
                            await sqs.deleteMessage({
                                QueueUrl: queueURL,
                                ReceiptHandle: mensagem.ReceiptHandle
                            }, (err, info) => {
                                if (err) {
                                    console.log('Erro ao excluír mensagem!');
                                    console.log(err);
                                } else {
                                    console.log('Mensagem processada e excluída com sucesso!');
                                }
                            });
                        } catch (err) {
                            console.log('Erro ao ler mensagem. Formato incorreto!')
                        }
                    }
                );
            }
        }
    });
}

function defineParametros(queueURL) {
    const params = {
        QueueUrl: queueURL,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20, //Long Polling
        VisibilityTimeout: 5
    }

    return params;
}

module.exports = {
    recebeMensagem
}
