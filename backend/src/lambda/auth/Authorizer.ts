import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as jwt from 'jsonwebtoken';

import { createLogger } from '../../utils/logger'

const logger = createLogger('Authenticate')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing event", event)

    const auth = JSON.parse(event.body)

    const token = auth.token 

    try{
        const decoded: any = await jwt.verify(token, "thisisnotagoodsecret")
        return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
              auth: true,
              username: decoded.username
            })
          } 
    }catch(e){
        return {
            statusCode: 401,
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                auth: false,
                message: 'Unauthorized'
            })
          }  
    }
}