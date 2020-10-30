import { Command } from './command.interface'
import { PermissionLevel } from './command.constants'
import { Message } from 'discord.js'
import { Task } from '../classes/task'
import { TodoistService } from '../services/todoist.service'

const todoistService: TodoistService = new TodoistService()
const fn: Command = {
  name: 'todo',
  description: ' Creates a new todo and sends it to the inbox',
  usage: '<title>',
  args: false,
  permission: PermissionLevel.none,
  execute: async (message: Message, args: string[]) => {
    let data: Task
    const content: string = args.join(' ')

    try {
      data = await todoistService.createTask(content)
    } catch (err) {
      console.log('Error receiving the post task data in [p]todo')
      return message.reply(
        'there was an error when trying to create the task via the API. Please try again later.'
      )
    }

    const msg: string = `✅ Task "${data.content}" created! See: ${data.url}`
    message.channel.send(msg)
  }
}

export = fn
