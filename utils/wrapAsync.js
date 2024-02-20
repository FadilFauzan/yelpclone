module.exports = func => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err))
    }
}