import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { User } from '../models/User'
// const AWSXRay = require('aws-xray-sdk')

// const XAWS = AWSXRay.captureAWS(AWS)



export class UserAccess {

    constructor(
      private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
      private readonly usersTable = process.env.USERS_TABLE,
      private readonly emailIndex = process.env.EMAIL_INDEX) {
    }

    async getUserbyUsername (username:string): Promise<User> {
      const result = await this.docClient.query({
        TableName: this.usersTable,
        KeyConditionExpression: 'username = :username' ,
        ExpressionAttributeValues: {
          ':username': username,
        },
      }).promise()
    
      const user = result.Items[0]
      return user as User
    }

    async getUserbyEmail (email:string): Promise<User> {
        const result = await this.docClient.query({
          TableName: this.usersTable,
          IndexName: this.emailIndex,
          KeyConditionExpression: 'email = :email' ,
          ExpressionAttributeValues: {
            ':email': email
          },
        }).promise()
      
        const user = result.Items[0]
        return user as User
    }

    async createUser(newUser: User): Promise<User> {
        await this.docClient
        .put({
          TableName: this.usersTable,
          Item: newUser
        })
        .promise()
      
        return newUser
    }

}

