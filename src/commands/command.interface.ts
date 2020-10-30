import { PermissionLevel } from './command.constants'

export interface Command {
  name: string
  description: string
  execute: ExecuteFunc
  args: boolean
  permission: PermissionLevel
  cooldown?: number
  aliases?: string[]
  usage?: string
}

type ExecuteFunc = (message, args) => void
