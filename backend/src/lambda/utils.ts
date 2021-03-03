import { APIGatewayProxyEvent } from "aws-lambda";

export function getUsername(event: APIGatewayProxyEvent): string {
  const username = event.headers.username
  return username
}