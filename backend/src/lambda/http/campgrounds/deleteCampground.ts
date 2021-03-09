import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../../utils/logger'
import {getUsername} from '../../utils'
import {deleteCampground, getCampground} from '../../../businessLogic/campgrounds';

const logger = createLogger('deleteCampgrounds')

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
  logger.info('Trying to delete item', {item})

  try{
    await deleteCampground(author, campgroundId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }  
  }catch(e){
    logger.info('Error deleting item', {
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