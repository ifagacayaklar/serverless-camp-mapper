const axios = require('axios');
const {apiId} = require('./config');
const ExpressError = require('./utils/ExpressError');
const busboy = require('connect-busboy');



module.exports.isLoggedIn = async(req, res, next) => {
    // console.log('Checking auth')
    const jwt = req.cookies.token
    
    if (!jwt){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }

    try{
        const options = { headers: { Authorization : `Bearer ${jwt}`, 'Content-Type': 'application/json' } }
        const apiRes = await axios.post(
            `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/users/auth`, {}, options
        )
        res.cookie('username',apiRes.data.username , { maxAge: 900000, httpOnly: true });
        next();
    } catch(e) {
        throw new ExpressError(e.message)
    }

}


module.exports.parseMultiPart = (req, res, next) =>{
    let images = {}
    let payload = {}
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    //   console.log('File [', filename);
      file.on('data', function(data) {
        if (!images[filename]){
            images[filename] = {data:null}
        }
        if (images[filename].data === null) {
            images[filename].data = data;
        } else {
            images[filename].data = Buffer.concat([images[filename].data, data]);
        }
      });
      file.on('end', function() {
        // console.log('File [' , filename , '] Finished');
      });
    });
    req.busboy.on('field', function(fieldname, val) {
      payload[fieldname] = val
    });
    req.busboy.on('finish', function() {
        req.body.payload = payload
        req.body.images = images
        // console.log('Done parsing form!');
        next()
    });
}

// module.exports.isAuthor = async(req, res, next) => {
    
//     const campgroundId = req.params.id;
//     const apiRes = await axios.get(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}`)
//     const campground = apiRes.data.items
    
//     if (!campground.author === req.cookies.username){
//         req.flash('error', 'You are not the author')
//         return res.redirect(`/campgrounds/${id}`)
//     }
//     req.items = {campground}
//     next();
// }

