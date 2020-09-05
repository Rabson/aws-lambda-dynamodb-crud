'use strict';
const fs = require('fs');
const path = require('path');
const { response, dynamo } = require('./utils');
const { userValidator } = require('./validator');

const usersTable = process.env.USERS_TABLE
const fsPromises = fs.promises;

// get html
module.exports.getHtml = async (event) => {
  try {
    const content = await fsPromises.readFile(path.resolve(__dirname + '/index.html'))
    return response.render({ content: content.toString(), });
  } catch (error) {
    console.log(error)
    return response.render({ content: `<h1>${error.message}</h1>` })
  }
};

// Create a user
module.exports.createUser = async (event) => {
  try {
    const reqBody = JSON.parse(event.body)
    await userValidator.create.validateAsync(reqBody);

    const { email, fullName, } = reqBody;

    const user = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      fullName,
      email,
    }

    await dynamo.call(dynamo.actions.add, { TableName: usersTable, Item: user, })

    return response.success({ statusCode: 201, data: { user }, message: 'Successfully Added', })

  } catch (error) {
    console.log(error)
    return response.failure({ error });
  }
};

// Get all user
module.exports.getAllUser = async event => {
  try {

    const { Items } = await dynamo.call(dynamo.actions.scan, { TableName: usersTable })

    return response.success({ statusCode: 200, data: { Items }, message: 'Success', })

  } catch (error) {
    console.log(error)
    return response.failure({ error });
  }
};

// Get user by id
module.exports.getUser = async event => {
  try {

    await userValidator.getById.validateAsync(event.pathParameters);

    const { id } = event.pathParameters;

    const params = { Key: { id: id }, TableName: usersTable, }
    const { Item } = await dynamo.call(dynamo.actions.get, params)

    return response.success({ statusCode: 200, data: { Item }, message: 'Success', })

  } catch (error) {
    console.log(error)
    return response.failure({ error });
  }
};

// Update User
module.exports.updateUser = async event => {
  try {
    const reqBody = JSON.parse(event.body);

    await userValidator.update.validateAsync({ ...reqBody, ...event.pathParameters });
    const { id } = event.pathParameters;
    const { fullName, email } = reqBody;

    const params = {
      Key: { id: id },
      TableName: usersTable,
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression: 'SET email = :email, fullName = :fullName',
      ExpressionAttributeValues: {
        ':email': email,
        ':fullName': fullName
      },
      ReturnValues: 'ALL_NEW'
    };

    const { Attributes } = await dynamo.call(dynamo.actions.update, params)

    return response.success({ statusCode: 201, data: { user: Attributes }, message: 'Successfully updated', })

  } catch (error) {
    console.log(error)
    return response.failure({ error });
  }
};

// delete User
module.exports.deleteUser = async event => {
  try {

    await userValidator.getById.validateAsync(event.pathParameters);

    const { id } = event.pathParameters;

    const params = { Key: { id: id }, TableName: usersTable };

    await dynamo.call(dynamo.actions.delete, params)

    return response.success({ statusCode: 200, data: { id }, message: 'Successfully deleted', })

  } catch (error) {
    console.log(error)
    return response.failure({ error });
  }
};
