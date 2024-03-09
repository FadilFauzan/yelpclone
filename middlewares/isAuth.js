module.exports.Auth = (req, res, next) =>{
    if (!req.isAuthenticated()) {
        req.flash('error_msg', 'You are not logged in')
        return res.redirect('/login')
    }

    next()
}

module.exports.Guest = (req, res, next) =>{
    if (req.isAuthenticated()) {
        req.flash('error_msg', 'You have logged in')
        res.redirect('/places')
    }

    next()
}