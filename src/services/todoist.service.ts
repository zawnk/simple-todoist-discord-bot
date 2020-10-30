import { AxiosResponse } from 'axios'
import { Task } from '../classes/task'
import { TodoistController } from '../controllers/todoist.controller'

const todoistController: TodoistController = new TodoistController()

export class TodoistService {
  constructor() {}

  public async createTask(content: string): Promise<Task> {
    let response: AxiosResponse<Task>

    try {
      response = await todoistController.sendPostRequest('tasks', { content })
    } catch (err) {
      console.log('Error creating task in createTodo().')
      throw new Error('Error creating task in createTodo().')
    }

    return response.data
  }
}
