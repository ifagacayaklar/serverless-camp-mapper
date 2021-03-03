const express = require('express');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
// const multer  = require('multer');
const router = express.Router();
// const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.renderIndex))
    .post(isLoggedIn, catchAsync(campgrounds.createCampground))
    // upload.array('image')
router.get('/new', isLoggedIn, campgrounds.renderCreateCampground)

router.route('/:id')
    .get(catchAsync(campgrounds.renderShowCampground))
    .put(isLoggedIn, isAuthor, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
    // upload.array('image')
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderUpdateCampground))

module.exports = router;