import 'source-map-support/register'
import * as jwt from 'jsonwebtoken';
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'

const logger = createLogger('Authenticate')

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    logger.info("Processing event", event)
    try{
        const authHeader = event.authorizationToken
        const token = getToken(authHeader)  
        const decoded: any = await jwt.verify(token, "thisisnotagoodsecret")
        return {
          principalId: decoded.username,
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: '*'
              }
            ]
          }
        }
    }catch(e){
      return {
        principalId: '',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Deny',
              Resource: '*'
            }
          ]
        }
      }
    }
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
