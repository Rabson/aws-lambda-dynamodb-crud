const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-8-10' });

/**
 * @name call
 * @param {*} action
 * @param {*} params
 */
const call = (action, params) => dynamoDb[action](params).promise();

const actions = { add: 'put', scan: 'scan', get: 'get', update: 'update', delete: 'delete' };

module.exports = { call, actions }