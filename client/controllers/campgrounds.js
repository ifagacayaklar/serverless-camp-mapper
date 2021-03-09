
const {apiId} = require('../config');
const axios = require('axios');

module.exports.renderIndex = async (req, res, next) => {
    const apiRes = await axios.get(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds`)
    const campgrounds = apiRes.data.items
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderCreateCampground = (req, res) => {
    res.render('campgrounds/new');
}


module.exports.uploadImages = async(req, res, next) =>{
    const jwt = req.cookies.token;
    const {images, campgroundId} = req.body
    let count =  1
    const options = { headers: { Authorization : `Bearer ${jwt}`, 'Content-Type': 'application/json' }}
    for (const image in images) {
        let file = images[image].data
        // console.log(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}_${count}/attachment`)
        const apiRes = await axios.post(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}_${count}/attachment`, {}, options)
        const uploadUrl = apiRes.data.uploadUrl
        count +=1
        await axios.put(uploadUrl, file)
    }
    res.redirect(`/campgrounds/${campgroundId}`)
}

module.exports.createCampground = async(req, res, next) => {

    const jwt = req.cookies.token;
    const {payload, images} = req.body
    const numImages = Object.keys(images).length
    payload.numImages = numImages
    if(!jwt){
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    const options = { headers: { Authorization : `Bearer ${jwt}`, 'Content-Type': 'application/json' } }
    const apiRes = await axios.post(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds`, payload, options)    
    if (apiRes.data && apiRes.data.message){
        if (apiRes.data.message === 'Invalid request body'){
            throw new ExpressError(apiRes.data.message, 400)
        }
    } 
    const campground = apiRes.data.item
    req.body.campgroundId = campground.campgroundId
    req.flash('success', `Successfully created`);
    req.flash('success', `${campground.title}`);
    next()
}

module.exports.renderShowCampground = async (req, res, next) => {
    const campgroundId = req.params.id
    const apiRes = await axios.get(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}`)
    const campground = apiRes.data.items
    if (!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderUpdateCampground = async (req, res, next) => {
    const campgroundId = req.params.id

    try{
        const apiRes = await axios.get(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}`)
        // console.log(apiRes)
        if (apiRes.data.items.author !== req.cookies.username){
            req.flash('error', 'You are not the author');
            return res.redirect(`/campgrounds/${id}`)          
        }
        const campground = apiRes.data.items
        res.render('campgrounds/edit', {campground});
    }catch(e){
        if (e.response && e.response.data.message == 'User is not authorized to access this resource with an explicit deny'){
            req.session.returnTo = req.originalUrl;
            req.flash('error', 'You must be signed in');
            return res.redirect('/login'); 
        }
        req.flash('error', 'Error while finding the campground');
        return res.redirect('/campgrounds');
    }
}

module.exports.updateCampground = async (req, res, next) => {
    const campgroundId = req.params.id
    const jwt = req.cookies.token
    if(!jwt){
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    const options = { headers: { Authorization : `Bearer ${jwt}`, 'Content-Type': 'application/json' } }
    const payload = req.body.campground;
    // console.log(payload)
    try{
        const apiRes = await axios.patch(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}`, payload, options)
        req.flash('success', `Successfully updated`);
        req.flash('success', `${payload.title}`);
        res.redirect(`/campgrounds/${campgroundId}`);
    }catch(e){
        // console.log(e.response)
        if (e.response.data.error === 'Author'){
            req.flash('error', 'You are not the author')
            return res.redirect(`/campgrounds/${campgroundId}`)    
        }else{
            req.flash('error', 'An error occured while update')
            return res.redirect(`/campgrounds/${campgroundId}`)   
        }
    }
}

module.exports.deleteCampground = async(req, res, next) => {
    const campgroundId = req.params.id
    const jwt = req.cookies.token
    const options = { headers: { Authorization : `Bearer ${jwt}`, 'Content-Type': 'application/json' }}
    try{
        const apiRes = await axios.delete(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}` ,options)
        req.flash('success', `Successfully deleted`);
        req.flash('success', `the campground`);
        res.redirect('/campgrounds'); 
    }catch(e){
        // console.log(e.response)
        if (e.response.data.error === 'Author'){
            req.flash('error', 'You are not the author')
            return res.redirect(`/campgrounds/${id}`)    
        }else{
            req.flash('error', 'An error occured while deletion')
            return res.redirect(`/campgrounds/${id}`)   
        }
    }
}