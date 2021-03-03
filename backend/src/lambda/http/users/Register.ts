import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { RegisterRequest } from '../../../requests/RegisterRequest'
import { createLogger } from '../../../utils/logger'
import {register} from '../../../businessLogic/users';

const logger = createLogger('createUser')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event", event)
  const user: RegisterRequest = JSON.parse(event.body)
  
  try {
    const JWT = await register(user)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        JWT: JWT
      })
    }

  } catch (err){
    if (err.name === 'UserExistError'){
      return {
        statusCode: 422,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'User may already exist'
        })
      }
    }
  }
}

