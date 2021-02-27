import * as uuid from 'uuid'

import { CampgroundItem } from '../models/CampgroundItem'
import { CampgroundAccess } from '../dataLayer/campgroundAccess'
import { CampgroundRequest } from '../requests/CampgroundRequest'

const campgroundAccess = new CampgroundAccess()
const bucketName = process.env.CAMPGROUNDS_S3_BUCKET

export async function getCampgrounds(): Promise<CampgroundItem[]> {
    return await campgroundAccess.getCampgrounds()
}

export async function getCampground(campgroundId: string): Promise<CampgroundItem> {
    return await campgroundAccess.getCampground(campgroundId)
}

export async function createCampground(
    author: string,
    newCampground: CampgroundRequest,    
): Promise<CampgroundItem> {
    const campgroundId = uuid.v4()

    const newItem = {
        campgroundId: campgroundId,
        author: author,
        ...newCampground,
        images: {url: `https://${bucketName}.s3.amazonaws.com/${campgroundId}`, filename:'test'},
        reviews : ['bad','nice']
      }
    
   return await campgroundAccess.createCampground(newItem) 
}

export async function updateCampground(
    author: string, 
    campgroundId: string, 
    updatedCampground: CampgroundRequest 
){
    await campgroundAccess.updateCampground(author, campgroundId, updatedCampground)
}

export async function deleteCampground(
    author: string, 
    campgroundId: string, 
     
){
    await campgroundAccess.deleteCampground(author, campgroundId)
}





