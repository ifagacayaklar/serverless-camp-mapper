import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CampgroundRequest } from '../../../requests/CampgroundRequest'
import { createLogger } from '../../../utils/logger'
import {getUsername} from '../../utils'
import {getCampground, updateCampground} from '../../../businessLogic/campgrounds';


const logger = createLogger('updateCampgrounds')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event", event)

  const author = getUsername(event)  
  const campgroundId = event.pathParameters.campgroundId
  const item = await getCampground(campgroundId)
  if (!item){
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Not Found',
        message:'Cannot find campground with given id'
      })
    }
  }
  if (item.author !== author){
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Author',
        message:'User is not the author'
      })
    }
  }
  logger.info('Trying to update item', {item})

  const updatedCampground: CampgroundRequest = JSON.parse(event.body)

  try{
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