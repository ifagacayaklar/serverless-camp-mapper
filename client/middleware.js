const axios = require('axios');
const {apiId} = require('./config');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = async(req, res, next) => {
    console.log('Checking auth')
    const token = req.cookies.token
    console.log(req.body)
    if (!token){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    const payload = {token:token}
    
    try{
        const apiRes = await axios.post(
            `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/users/auth`, payload
        )
        req.username = apiRes.data.username
        next();
    } catch(e) {
        throw new ExpressError(e.message)
    }

}

module.exports.isAuthor = async(req, res, next) => {
    
    const campgroundId = req.params.id;
    const apiRes = await axios.get(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}`)
    const campground = apiRes.data.items
    
    if (!campground.author.equals(req.username)){
        req.flash('error', 'You are not the author')
        return res.redirect(`/campgrounds/${id}`)
    }
    req.items.campground = campground
    next();
}

