/** 
 * @param {@} res 
 * @param {*} statusCode 
 * @param {*} message 
 * @param {*} data 
 * @description Sends the success response to the client
 */
const successResponse = (res, code = 200, message = "", data = {}) => {

    const response = {
        "code": code,
        "status": true,
        "message": message,
        "data": data
    }

    res.status(code).json(response);

}

/**
 * @param {*} res 
 * @param {*} statusCode 
 * @param {*} message 
 * @description Sends the error response to the client
 */
const errorResponse = (res, code = 500, message = "Internal server error") => {

    const response = {
        "code": code,
        "status": false,
        "message": message
    }
    res.status(code).json(response);

}

module.exports = {
    successResponse,
    errorResponse
}