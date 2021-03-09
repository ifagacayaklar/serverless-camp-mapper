import { APIGatewayProxyEvent } from "aws-lambda";

export function getUsername(event: APIGatewayProxyEvent): string {
  const username = event.requestContext.authorizer.principalId
  return username
}