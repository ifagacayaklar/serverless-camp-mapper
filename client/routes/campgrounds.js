const express = require('express');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, parseMultiPart} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
// const multer  = require('multer');
const router = express.Router();
// const upload = multer({ storage });
const busboy = require('connect-busboy');

router.route('/')
    .get(catchAsync(campgrounds.renderIndex))
    .post(busboy({ immediate: true }),parseMultiPart, catchAsync(campgrounds.createCampground), catchAsync(campgrounds.uploadImages))
router.get('/new', isLoggedIn, campgrounds.renderCreateCampground)

router.route('/:id')
    .get(catchAsync(campgrounds.renderShowCampground))
    .put(catchAsync(campgrounds.updateCampground))
    .delete(catchAsync(campgrounds.deleteCampground))
router.get('/:id/edit', isLoggedIn, catchAsync(campgrounds.renderUpdateCampground))

module.exports = router;