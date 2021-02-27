import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { CampgroundItem } from '../models/CampgroundItem'
import { CampgroundRequest } from '../requests/CampgroundRequest'
// const AWSXRay = require('aws-xray-sdk')

// const XAWS = AWSXRay.captureAWS(AWS)


export class CampgroundAccess {

    constructor(
      private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
      private readonly campgroundsTable = process.env.CAMPGROUNDS_TABLE) {
    }

    async getCampgrounds (): Promise<CampgroundItem[]> {
      const result = await this.docClient.scan({
        TableName: this.campgroundsTable
      }).promise()
    
      const items = result.Items
      return items as CampgroundItem[]
    }

    async getCampground (campgroundId:string): Promise<CampgroundItem> {
        const result = await this.docClient.query({
          TableName: this.campgroundsTable,
          KeyConditionExpression: 'campgroundId = :campgroundId',
          ExpressionAttributeValues: {
            ':campgroundId': campgroundId
          },
          ScanIndexForward: false
        }).promise()
      
        const item = result.Items[0]
        return item as CampgroundItem
    }

    async createCampground(newItem: CampgroundItem): Promise<CampgroundItem> {
        await this.docClient
        .put({
          TableName: this.campgroundsTable,
          Item: newItem
        })
        .promise()
      
        return newItem
    }

    async updateCampground(author: string, campgroundId: string, updatedCampground: CampgroundRequest){
        await this.docClient.update({
            TableName: this.campgroundsTable,
            Key:{
                "author": author,
                "campgroundId": campgroundId
            }, 
            UpdateExpression: "set title = :title, price = :price, #locationfield = :location, description = :description",
            ExpressionAttributeValues:{
              ":title": updatedCampground.title,
              ":price": updatedCampground.price,
              ":location": updatedCampground.location,
              ":description": updatedCampground.description
            },
            ExpressionAttributeNames:
            { "#locationfield": "location" },
        }).promise()
    }

    async deleteCampground(author: string, campgroundId: string) {
        await this.docClient.delete({
            TableName:this.campgroundsTable,
            Key:{
                "author": author,
                "campgroundId": campgroundId
            } 
          }).promise()
    }
    
}