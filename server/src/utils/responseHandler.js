/**
 * Standardized JSON response helper methods
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
    const response = {
        success: true,
        message,
    };
    if (data !== null) {
        response.data = data;
    }
    return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
    const response = {
        success: false,
        message,
    };
    if (errors) {
        response.errors = errors;
    }
    return res.status(statusCode).json(response);
};

module.exports = {
    sendSuccess,
    sendError,
};
