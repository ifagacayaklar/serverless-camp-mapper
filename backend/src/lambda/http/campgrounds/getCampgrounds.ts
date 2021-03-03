import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getCampgrounds} from '../../../businessLogic/campgrounds';

import { createLogger } from '../../../utils/logger'

const logger = createLogger('getCampgrounds')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info("Processing event", event)
  const items = await getCampgrounds()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: items
    })
  }
}