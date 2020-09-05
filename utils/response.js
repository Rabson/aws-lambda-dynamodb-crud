/**
 * @name buildResponse Return a formatted object
 * @param {*} statusCode
 * @param {*} body
 */
const buildResponse = ({ statusCode, body }) => ({
    statusCode: statusCode,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
});

/**
 * @name failure
 * @param {*} statusCode default 500
 * @param {*} error default null
 * @param {*} message default Failure
 */
const failure = ({ statusCode = 500, error = null, message = 'Failure' }) => buildResponse({
    statusCode, body: {
        error,
        message,
    }
});

/**
 * @name success
 * @param {*} statusCode default 200
 * @param {*} data Empty Object
 * @param {*} message default Success
 * @param {*} body
 */
const success = ({ statusCode = 200, data = {}, message = 'Success' }) => buildResponse({
    statusCode, body: {
        data,
        message
    }
});

/**
 * @name render
 * @param {*} content ""
 */
const render = ({ content = "" }) => ({
    statusCode: 200,
    body: content,
    headers: { 'Content-Type': 'text/html', }
});


module.exports = { failure, success, render }