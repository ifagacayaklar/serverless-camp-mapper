import * as uuid from 'uuid'

import { CampgroundItem } from '../models/CampgroundItem'
import { CampgroundAccess } from '../dataLayer/campgroundAccess'
import { CampgroundRequest } from '../requests/CampgroundRequest'
import { CampgroundUpdate } from '../requests/CampgroundUpdate'
import { createLogger } from '../utils/logger'

const campgroundAccess = new CampgroundAccess()
const bucketName = process.env.CAMPGROUNDS_S3_BUCKET
const logger = createLogger('Campground Businesslogic')

export async function getCampgrounds(): Promise<CampgroundItem[]> {
    logger.info('Getting campgrounds')
    return await campgroundAccess.getCampgrounds()
}

export async function getCampground(campgroundId: string): Promise<CampgroundItem> {
    logger.info('Getting campground single campground', {campgroundId})
    return await campgroundAccess.getCampground(campgroundId)
}

export async function createCampground( author: string, newCampground: CampgroundRequest): Promise<CampgroundItem> {
    const campgroundId = uuid.v4()
    const images = []

    for (let i = 1; i <= newCampground.numImages; i += 1){
        let url = `https://${bucketName}.s3.eu-central-1.amazonaws.com/${campgroundId}_${i}`
        let filename = `image_${i}`
        images.push({url, filename})
    }

    delete newCampground['numImages']; 

    const newItem = {
        campgroundId: campgroundId,
        author: author,
        ...newCampground,
        images: images,
      }

    logger.info('Creating campground', {campgroundId})
    return await campgroundAccess.createCampground(newItem) 
}

export async function updateCampground(
    author: string, 
    campgroundId: string, 
    updatedCampground: CampgroundUpdate 
){
    logger.info('Update campground', {
        author: author,
        campgroundId: campgroundId,
        updatedCampground: updatedCampground
    })
    const apiRes = await campgroundAccess.updateCampground(author, campgroundId, updatedCampground)
    logger.info('Update campground finished', {apiRes}) 
}

export async function deleteCampground(
    author: string, 
    campgroundId: string, 
){
    logger.info('Delete campground', {
        author: author,
        campgroundId: campgroundId
    })
    const apiRes = await campgroundAccess.deleteCampground(author, campgroundId) 
    logger.info('Delete campground finished', {apiRes}) 
}





