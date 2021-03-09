import { CampgroundAttachment } from '../fileStoreLayer/campgroundAttachment'

const campgroundAttachment = new CampgroundAttachment()

export function getUploadUrl(campgroundId: string) {
    return campgroundAttachment.getUploadUrl(campgroundId)
}


