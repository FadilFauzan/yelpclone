module.exports = (req, res, next) =>{
    if (req.isAuthenticated()) {
        req.flash('error_msg', 'You have logged in')
        res.redirect('/places')
    }

    next()
}