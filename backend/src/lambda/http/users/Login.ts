import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {login} from '../../../businessLogic/users';
import { LoginRequest } from '../../../requests/LoginRequest'

import { createLogger } from '../../../utils/logger'

const logger = createLogger('getUser')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info("Processing event", event)
  const user: LoginRequest = JSON.parse(event.body)


  const JWT = await login(user)

  if(!JWT){
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Unauthorized'
      })
    } 
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      JWT: JWT
    })
  }
}