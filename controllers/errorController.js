const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => {
    return new AppError('Invalid token. Please log in again!', 401);
}

const handleJWTExpiredError = () => {
    return new AppError('Your token has expired! Please log in again', 401);
}

const createSendMsg = (req, res, statusCode, subject, message) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(statusCode).render('error', {
            status: subject,
            message
        });
    } else {
        res.status(statusCode).render('error', {
            title: subject,
            message
        });
    }
}

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        return createSendMsg(req, res, err.statusCode, 'Something went wrong', err.message);
    }
}

const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return createSendMsg(req, res, err.statusCode, err.status, err.message);
        }
        console.error('ERROR', err);
        return createSendMsg(req, res, 500, 'error', 'Something went wrong');
    }

    if (err.isOperational) {
        return createSendMsg(req, res, err.statusCode, 'Something went wrong', err.message);
    }

    console.error('ERROR', err);
    return createSendMsg(req, res, err.statusCode, 'Something went wrong', 'Please try again later.');
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        // 'err'オブジェクトから'error'オブジェクトを作成する
        let error = Object.assign(err);

        console.log(error);

        if (error.message.includes('Cast')) error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error._message === 'Validation failed') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
}