const jwt = require('jsonwebtoken');
const User = require('../models/User');



const requireAuth = (req, res, next) => {

    const token= req.cookies.jwt;

    // check json token exist 
    if (token) {
        jwt.verify(token, 'faysal ahmad', (err, docodedToken) => {
            if (err) {
                console.log(err.message)
                res.redirect('/login')
            }else{
                console.log(docodedToken)
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}


// check cureent user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt 


    if (token) {
        jwt.verify(token, 'faysal ahmad', async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null;
                next()
            }else{
                console.log(decodedToken)
                let user = await User.findById( decodedToken.id )
                res.locals.user = user;
                next()
            }
        })
    } else {
        
        res.locals.user = null;
        next()
    }
}

module.exports = {requireAuth  ,  checkUser}