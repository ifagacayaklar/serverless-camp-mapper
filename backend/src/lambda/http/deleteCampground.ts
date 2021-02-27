import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import {getUserId} from '../utils'
import {deleteCampground} from '../../businessLogic/campgrounds';

const logger = createLogger('deleteCampgrounds')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event", event)
  const author = getUserId(event)  
  const campgroundId = event.pathParameters.campgroundId
  
  try{
    logger.info('Trying to delete item', {
      author: author,
      campgroundId: campgroundId
    })
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

