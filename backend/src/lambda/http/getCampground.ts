import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getCampground} from '../../businessLogic/campgrounds';

import { createLogger } from '../../utils/logger'

const logger = createLogger('getCampground')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info("Processing event", event)
  const campgroundId = event.pathParameters.campgroundId
  const item = await getCampground(campgroundId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: item
    })
  }
}