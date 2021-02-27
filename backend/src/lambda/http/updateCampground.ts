import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CampgroundRequest } from '../../requests/CampgroundRequest'
import { createLogger } from '../../utils/logger'
import {getUserId} from '../utils'
import {updateCampground} from '../../businessLogic/campgrounds';


const logger = createLogger('updateCampgrounds')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event", event)

  const author = getUserId(event)  
  const campgroundId = event.pathParameters.campgroundId
  const updatedCampground: CampgroundRequest = JSON.parse(event.body)

  try{
    logger.info('Trying to update item', {
      author: author,
      campgroundId: campgroundId
    })
    await updateCampground(author, campgroundId, updatedCampground)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }  
  }catch(e){
    logger.info('Error updating item', {
      message: e.message
    })
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }
}




