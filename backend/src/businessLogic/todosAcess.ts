import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
// import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
// const logger = createLogger('TodosAccess')

const todoTable = process.env.TODOS_TABLE
const todostableindex = process.env.TODOS_USER_ID_INDEX

export class TodosAccess{
    constructor(){}
    async getTodosForUser (userId: string): Promise<TodoItem[]>{
        const result = await docClient.query({
            TableName : todoTable,
            IndexName: todostableindex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return result.Items as TodoItem[]
    }
    
    async createTodos (todoItem: TodoItem): Promise<TodoItem>{
        await docClient
        .put({
          TableName: todoTable,
          Item: todoItem
        })
        .promise()
        return todoItem
    }
    
    async updateTodos (todoUpdate: TodoUpdate,userId: string, todoId: string): Promise<TodoUpdate>{
        const result = await docClient
        .update({
          TableName: todoTable,
          Key: {
            userId: userId,
            todoId: todoId
          },
          UpdateExpression: 'set #field1 = :value1, #field2 = :value2, #field3 = :value3',
          ExpressionAttributeNames: {
            '#field1': 'name',
            '#field2': 'dueDate',
            '#field3': 'done'
          },
          ExpressionAttributeValues: {
            ':value1': todoUpdate['name'],
            ':value2': todoUpdate['dueDate'],
            ':value3': todoUpdate['done']
          },
        })
        .promise()
        return result.Attributes as TodoUpdate
    }

    async updateAttachmentUrl (attachmentUrl: string,userId: string, todoId: string){
      await docClient
      .update({
        TableName: todoTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: 'set #field1 = :value1',
        ExpressionAttributeNames: {
          '#field1': 'attachmentUrl'
        },
        ExpressionAttributeValues: {
          ':value1': attachmentUrl.split("?")[0]
        },
      })
      .promise()
  }

    async deleteTodo (todoId: string,userId:string){
      await docClient
      .delete({
        TableName: todoTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
      })
      .promise()
    }
}



