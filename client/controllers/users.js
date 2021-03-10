const {apiId} = require('../config');
const axios = require('axios');

module.exports.renderRegisterUser = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const options = { headers: {'Content-Type': 'application/json' } }
        const payload = { 
            email:email,
            username:username,
            password:password
        }
        const apiRes = await axios.post(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/users/register`, payload, options)
        res.cookie('username',username , { maxAge: 900000, httpOnly: true });
        res.cookie('token',apiRes.data.JWT , { maxAge: 900000, httpOnly: true });
        req.flash('success', 'Welcome to Camp Mapper');
        res.redirect('/campgrounds')
    } catch (e) {
        if (e.response && e.response.data && e.response.data.message){
            req.flash('error', e.response.data.message)
            res.redirect('/register')
        }else{
            req.flash('error', e.message)
            res.redirect('/register')
        }
    }
}

module.exports.renderLoginUser = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser =  async (req, res) => {
    try {
        const {username, password} = req.body;
        const options = { headers: {'Content-Type': 'application/json' } }
        const payload = {
            username: username, 
            password: password
        }
        const apiRes = await axios.post(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/users/login`, payload, options)
        res.cookie('username',username , { maxAge: 900000, httpOnly: true });
        res.cookie('token',apiRes.data.JWT , { maxAge: 900000, httpOnly: true });
        req.flash('success', 'Welcome Back!');
        redirectUrl = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message){
            if (e.response.data.message === 'Internal server error'){
                req.flash('error', 'Username or password is wrong')
                res.redirect('/register')
            }else{
                req.flash('error', e.response.data.message)
                res.redirect('/register')
            }
        }else{
            req.flash('error', e.message)
            res.redirect('/register')
        }

    }

}

module.exports.logoutUser = (req, res) => {
    res.clearCookie('token'); 
    res.clearCookie('username'); 
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds')
}