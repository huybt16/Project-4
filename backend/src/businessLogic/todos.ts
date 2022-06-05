import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate';


const todoAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getTodosForUser(userId: string):Promise<TodoItem[]>{
    return todoAccess.getTodosForUser(userId);
} 

export async function createTodo(userId:string, request: CreateTodoRequest):Promise<TodoItem>{
    const id = uuid.v4()
    const newTodoItem: TodoItem = {
        userId: userId,
        todoId: id,
        createdAt: new Date().toISOString(),
        name: request.name,
        dueDate: request.dueDate,
        done: false,
        attachmentUrl:''
    }
    return todoAccess.createTodos(newTodoItem)
}

export async function updateTodo(userId:string, todoId:string, request: UpdateTodoRequest):Promise<TodoUpdate>{
    const todoUpdate: TodoUpdate = {
        name: request.name,
        dueDate: request.dueDate,
        done: request.done,
    }
    return todoAccess.updateTodos(todoUpdate,userId,todoId)
}

export async function deleteTodo(todoId:string,userId:string){
    todoAccess.deleteTodo(todoId,userId)
}

export async function createAttachmentPresignedUrl(todoId:string,userId:string):Promise<string> {
    const uploadUrl = await attachmentUtils.createAttachmentPresignedUrl(todoId)
    todoAccess.updateAttachmentUrl(uploadUrl,userId,todoId)
    return uploadUrl
}


