import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CampgroundRequest } from '../../../requests/CampgroundRequest'
import { createLogger } from '../../../utils/logger'
import {getUsername} from '../../utils'
import {createCampground} from '../../../businessLogic/campgrounds';

const logger = createLogger('createCampgrounds')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event", event)
  const newCampground: CampgroundRequest = JSON.parse(event.body)
  const author = getUsername(event)
  
  const newItem = await createCampground(author, newCampground)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}