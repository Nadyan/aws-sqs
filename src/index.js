require('dotenv').config();

const AWS = require('aws-sdk');
const { enviaMensagem } = require('./operations/send');
const { recebeMensagem } = require('./operations/receive');

AWS.config.update({
    region: 'us-east-1'
});

const sqs = new AWS.SQS();
const queueURL = 'https://sqs.us-east-1.amazonaws.com/062997058395/vendas';
const dlqURL = 'https://sqs.us-east-1.amazonaws.com/062997058395/vendas-dlq';

//enviaMensagem(sqs, queueURL);
recebeMensagem(sqs, queueURL);
