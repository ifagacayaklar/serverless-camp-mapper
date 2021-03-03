
const {apiId} = require('../config');
const axios = require('axios');

module.exports.renderIndex = async (req, res, next) => {
    const apiRes = await axios.get(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds`)
    const campgrounds = apiRes.data.items
    console.log(campgrounds)
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderCreateCampground = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res, next) => {

    const username = req.username;
    const options = { headers: { username : username, 'Content-Type': 'application/json' } }
    const payload = req.body.campground;
    payload.price = 10  

    //TODO Campgorunds
    console.log(payload)
    const apiRes = await axios.post(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds`, payload, options)    

    if (apiRes.data && apiRes.data.message){
        if (apiRes.data.message === 'Invalid request body'){
            throw new ExpressError(apiRes.data.message, 400)
        }
    } 

    const campground = apiRes.data.item

    req.flash('success', `Successfully created`);
    req.flash('success', `${campground.title}`);
    res.redirect(`/campgrounds/${campground.campgroundId}`)
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
    const campground = req.items.campground
    
    if (!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req, res, next) => {
    const campgroundId = req.params.id
    const username = req.username
    const options = { headers: { username : username, 'Content-Type': 'application/json' } }
    const payload = req.body.campground;
    const apiRes = await axios.patch(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}`, payload, options)
    const imgs = req.files.map(f => ({url: f.path, filename:f.filename}))

    req.flash('success', `Successfully updated`);
    req.flash('success', `${payload.title}`);
    res.redirect(`/campgrounds/${campgroundId}`);
}

module.exports.deleteCampground = async(req, res, next) => {
    const campgroundId = req.params.id
    const campground = req.items.campground
    
    const options = { headers: { username : username, 'Content-Type': 'application/json' } }
    const apiRes = await axios.delete(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}` ,options)
    req.flash('success', `Successfully deleted`);
    req.flash('success', `${campground.title}`);
    res.redirect('/campgrounds');   
}