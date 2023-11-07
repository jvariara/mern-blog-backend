export const errorResponserHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 400
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

// if someone goes to a path that doesnt exist,like /api/user/registerrrrr
export const invalidPathHandler = (req, res, next) => {
    const error = new Error("Invalid Path")
    error.statusCode = 404
    next(error)
}
