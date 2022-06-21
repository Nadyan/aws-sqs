
async function recebeMensagem(sqs, queueURL) {
    const params = defineParametros(queueURL);
    await sqs.receiveMessage(params, (err, info) => {
        if (err) {
            console.log('Problemas ao receber mensagens!');
            console.log(err, err.stack);
            return;
        } else {
            console.log('Mensagens recebidas com sucesso!');
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
                            console.log('Erro ao processar mensagem. Formato incorreto!')
                        }
                    }
                );
            }
        }
    });
}

async function recebeMensagemDlq(sqs, queueURL) {
    const params = defineParametros(queueURL);
    console.log('Recebendo mensagens da DLQ...');
    await sqs.receiveMessage(params, (err, info) => {
        if (err) {
            console.log('Problemas ao receber mensagens!');
            console.log(err, err.stack);
            return;
        } else {
            console.log('Mensagens da DLQ recebidas com sucesso!');
            if (info.Messages) {
                info.Messages.forEach(
                    async mensagem => {
                        try {
                            const body = JSON.parse(mensagem.Body);

                            console.log('Processando mensagem...');
                            console.log(body);
                            
                            await sqs.deleteMessage({
                                QueueUrl: queueURL,
                                ReceiptHandle: mensagem.ReceiptHandle
                            }, (err, info) => {
                                if (err) {
                                    console.log('Erro ao excluír mensagem!');
                                    console.log(err);
                                } else {
                                    console.log('Mensagem exibida e excluída com sucesso!');
                                }
                            });
                        } catch (err) {
                            console.log('Erro ao ler mensagem!');
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
        WaitTimeSeconds: 10, //Long Polling
        VisibilityTimeout: 5
    }

    return params;
}

module.exports = {
    recebeMensagem,
    recebeMensagemDlq
}
